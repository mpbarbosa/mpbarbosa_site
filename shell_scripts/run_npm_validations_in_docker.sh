#!/usr/bin/env bash
################################################################################
# Script: run_npm_validations_in_docker.sh
# Description: Build a Docker image for this repository and run all npm test
#              suites and validations inside an isolated container.
# Version: 1.1.4
# Author: MP Barbosa
################################################################################

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly DEFAULT_IMAGE_TAG="mpbarbosa-site-validations:node25-bookworm"
readonly DEFAULT_PLATFORM="linux/amd64"
readonly CONTAINER_REPO_PATH="/repo"
readonly CONTAINER_WORKSPACE="/workspace"

readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

IMAGE_TAG="$DEFAULT_IMAGE_TAG"
DOCKER_PLATFORM="${DOCKER_PLATFORM:-$DEFAULT_PLATFORM}"
REBUILD_IMAGE=false

print_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

show_usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Run all npm validations and test suites for this repository inside Docker.

OPTIONS:
    -p, --platform VALUE     Docker platform to use (default: $DEFAULT_PLATFORM)
    -i, --image-tag VALUE    Docker image tag to build/run
    -r, --rebuild            Rebuild the Docker image even if it already exists
    -h, --help               Show this help message

EXAMPLES:
    $(basename "$0")
    $(basename "$0") --platform linux/arm64
    $(basename "$0") --rebuild

NOTES:
    - The repository is mounted read-only into the container and copied to an
      ephemeral workspace before npm install commands run.
    - The image installs Chromium so the Pa11y accessibility suite can run.
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -p|--platform)
                if [[ -n "${2:-}" ]]; then
                    DOCKER_PLATFORM="$2"
                    shift 2
                else
                    print_error "Missing value for $1"
                    exit 1
                fi
                ;;
            -i|--image-tag)
                if [[ -n "${2:-}" ]]; then
                    IMAGE_TAG="$2"
                    shift 2
                else
                    print_error "Missing value for $1"
                    exit 1
                fi
                ;;
            -r|--rebuild)
                REBUILD_IMAGE=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

require_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        print_error "Docker is required but was not found in PATH."
        exit 1
    fi
}

build_image() {
    if [[ "$REBUILD_IMAGE" == false ]] && docker image inspect "$IMAGE_TAG" >/dev/null 2>&1; then
        print_info "Using existing Docker image: $IMAGE_TAG"
        return 0
    fi

    print_info "Building Docker image: $IMAGE_TAG"
    docker build \
        --platform "$DOCKER_PLATFORM" \
        --tag "$IMAGE_TAG" \
        - <<'EOF'
FROM node:25-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH=/usr/bin/chromium
EOF
}

run_validations() {
    print_info "Running validations in Docker on platform: $DOCKER_PLATFORM"
    docker run \
        --rm \
        --platform "$DOCKER_PLATFORM" \
        -e CI=true \
        -e CHROME_PATH=/usr/bin/chromium \
        -v "$PROJECT_ROOT:$CONTAINER_REPO_PATH:ro" \
        "$IMAGE_TAG" \
        bash -s -- <<'EOF'
set -euo pipefail

readonly SOURCE_REPO="/repo"
readonly WORKSPACE="/workspace"

print_section() {
    printf '\n========== %s ==========\n' "$1"
}

run_step() {
    local label="$1"
    shift
    printf '\n-- %s\n' "$label"
    "$@"
}

cleanup_server() {
    if [[ -n "${server_pid:-}" ]] && kill -0 "$server_pid" >/dev/null 2>&1; then
        kill "$server_pid"
        wait "$server_pid" || true
    fi
}

trap cleanup_server EXIT

rm -rf "$WORKSPACE"
mkdir -p "$WORKSPACE"
cp -a "$SOURCE_REPO"/. "$WORKSPACE"

print_section "Installing dependencies"
cd "$WORKSPACE"
run_step "npm ci (root)" npm ci

cd "$WORKSPACE/src"
run_step "npm ci (src)" npm ci

print_section "Source validations"
run_step "npm run lint" npm run lint
run_step "npm run lint:md" npm run lint:md
run_step "npm run format:check" npm run format:check
run_step "npm run build" npm run build

print_section "Source test suites"
run_step "npm test" npm test
run_step "npm run test:coverage" npm run test:coverage
run_step "npm run test:unit" npm run test:unit
run_step "npm run test:integration" npm run test:integration
run_step "npm run test:shell" npm run test:shell
run_step "npm run test:docs" npm run test:docs
run_step "npm run test:a11y" npm run test:a11y

print_section "Pa11y accessibility suite"
npx --no-install live-server . --host=127.0.0.1 --port=8080 >/tmp/live-server.log 2>&1 &
server_pid=$!
npx --no-install wait-on http://127.0.0.1:8080
run_step "npm run test:pa11y" npm run test:pa11y

print_section "Root npm proxy validations"
cd "$WORKSPACE"
run_step "npm test" npm test
run_step "npm run test:ci" npm run test:ci
run_step "npm run test:coverage" npm run test:coverage
run_step "npm run lint:md" npm run lint:md
EOF
}

main() {
    parse_args "$@"
    require_docker

    echo "========================================================================"
    echo "Docker npm validations runner"
    echo "========================================================================"
    echo "Project Root:     $PROJECT_ROOT"
    echo "Docker Platform:  $DOCKER_PLATFORM"
    echo "Docker Image Tag: $IMAGE_TAG"
    echo "========================================================================"

    build_image
    run_validations

    print_success "All Docker npm validations completed."
}

main "$@"
