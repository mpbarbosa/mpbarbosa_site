# Step 9: Code_Quality_Validation

**Workflow Run ID:** workflow_20251222_173618
**Timestamp:** 2025-12-22 18:03:41
**Status:** Issues Found

---

## Issues and Findings

### Code Quality Validation Issues Found

**Total Issues:** 4

### Details

```
File count: 123 javascript files
Linter issues: 10
[0;36mℹ️  Executing Linting: npm run lint[0m
npm error Missing script: "lint"
npm error
npm error Did you mean this?
npm error   npm link # Symlink a package folder
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /home/mpb/.npm/_logs/2025-12-22T20_59_51_761Z-debug-0.log
[0;31m❌ ERROR: Linting failed (exit code: 1)[0m
Large file: ./__tests__/main.test.js (495 lines)
Large file: ./__tests__/InitializationUtilities.test.js (869 lines)
Large file: ./__tests__/shell_scripts.test.js (849 lines)
Large file: ./__tests__/sync_to_public.test.js (713 lines)
Large file: ./assets/js/util.js (586 lines)
Large file: ./assets/js/main.js (400 lines)
Large file: ./scripts/initialization/InitializationUtilities.js (745 lines)
Large file: ./submodules/music_in_numbers/src/sw.js (348 lines)
Large file: ./submodules/music_in_numbers/src/scripts/data-export/DataExportUIBuilders.js (489 lines)
Large file: ./submodules/music_in_numbers/src/scripts/data-export/VALIDATION_TEST.js (372 lines)
Large file: ./submodules/music_in_numbers/src/scripts/data-export/DataExportUtilities.js (691 lines)
Large file: ./submodules/music_in_numbers/src/scripts/data-export/DataExportProcessors.js (450 lines)
Large file: ./submodules/music_in_numbers/src/scripts/data-export/DataExportCore.js (961 lines)
Large file: ./submodules/music_in_numbers/src/scripts/data-export/DataExportValidators.js (381 lines)
Large file: ./submodules/music_in_numbers/src/scripts/ui-components.js (1294 lines)
Large file: ./submodules/music_in_numbers/src/scripts/initialization.js (406 lines)
Large file: ./submodules/music_in_numbers/src/scripts/initialization/InitializationCore.js (597 lines)
Large file: ./submodules/music_in_numbers/src/scripts/initialization/InitializationUIBuilders.js (523 lines)
Large file: ./submodules/music_in_numbers/src/scripts/initialization/InitializationUtilities.js (761 lines)
Large file: ./submodules/music_in_numbers/src/scripts/initialization/InitializationProcessors.js (390 lines)
Large file: ./submodules/music_in_numbers/src/scripts/utils.js (381 lines)
Large file: ./submodules/music_in_numbers/src/scripts/performance/PerformanceValidators.js (546 lines)
Large file: ./submodules/music_in_numbers/src/scripts/performance/PerformanceProcessors.js (584 lines)
Large file: ./submodules/music_in_numbers/src/scripts/performance/PerformanceUtilities.js (622 lines)
Large file: ./submodules/music_in_numbers/src/scripts/performance/PerformanceCore.js (765 lines)
Large file: ./submodules/music_in_numbers/src/scripts/performance/PerformanceUIBuilders.js (734 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIValidators.js (569 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIUtilities.js (1187 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-ui/ArtistUICore.js (731 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIBuilders.js (603 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIProcessors.js (581 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-ui.js (453 lines)
Large file: ./submodules/music_in_numbers/src/scripts/ui-components/UIComponentsBuilders.js (608 lines)
Large file: ./submodules/music_in_numbers/src/scripts/ui-components/UIComponentsCore.js (590 lines)
Large file: ./submodules/music_in_numbers/src/scripts/ui-components/UIComponentsProcessors.js (386 lines)
Large file: ./submodules/music_in_numbers/src/scripts/ui-components/UIComponentsValidators.js (367 lines)
Large file: ./submodules/music_in_numbers/src/scripts/ui-components/UIComponentsUtilities.js (628 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-page/ArtistPageCore.js (588 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-page/ArtistPageValidators.js (391 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-page/ArtistPageProcessors.js (475 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-page/ArtistPageUIBuilders.js (536 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-page/ArtistPageUtilities.js (659 lines)
Large file: ./submodules/music_in_numbers/src/scripts/real-time/RealTimeUtilities.js (374 lines)
Large file: ./submodules/music_in_numbers/src/scripts/real-time/RealTimeCore.js (342 lines)
Large file: ./submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerUIBuilders.js (419 lines)
Large file: ./submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerUtilities.js (507 lines)
Large file: ./submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerCore.js (555 lines)
Large file: ./submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerProcessors.js (306 lines)
Large file: ./submodules/music_in_numbers/src/scripts/spotify-api.js (1855 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-api/ArtistApiProcessors.js (386 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-api/ArtistApiUIBuilders.js (475 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-api/ArtistApiUtilities.js (641 lines)
Large file: ./submodules/music_in_numbers/src/scripts/artist-api/ArtistApiCore.js (431 lines)
Large file: ./submodules/music_in_numbers/src/scripts/performance.js (793 lines)
Large file: ./submodules/music_in_numbers/src/scripts/utils/UtilsProcessors.js (305 lines)
Large file: ./submodules/music_in_numbers/src/scripts/utils/UtilsBuilders.js (305 lines)
Large file: ./submodules/music_in_numbers/src/scripts/utils/UtilsUtilities.js (398 lines)
Large file: ./submodules/music_in_numbers/src/scripts/utils/UtilsCore.js (395 lines)
Large file: ./submodules/music_in_numbers/src/scripts/spotify-api/__tests__/SpotifyApiCore.test.js (1513 lines)
Large file: ./submodules/music_in_numbers/src/scripts/spotify-api/SpotifyApiUtilities.js (334 lines)
Large file: ./submodules/music_in_numbers/src/scripts/spotify-api/SpotifyApiCore.js (937 lines)
Large file: ./submodules/music_in_numbers/src/scripts/spotify-api/SpotifySessionDetector.js (481 lines)
Large file: ./submodules/music_in_numbers/src/scripts/spotify-api/SpotifyApiValidators.js (415 lines)
Large file: ./submodules/music_in_numbers/src/scripts/analytics/__tests__/AnalyticsProcessors.test.js (1104 lines)
Large file: ./submodules/music_in_numbers/src/scripts/analytics/__tests__/AnalyticsCore.test.js (984 lines)
Large file: ./submodules/music_in_numbers/src/scripts/analytics/AnalyticsUtilities.js (425 lines)
Large file: ./submodules/music_in_numbers/src/scripts/analytics/AnalyticsCore.js (523 lines)
Large file: ./submodules/music_in_numbers/src/scripts/analytics/AnalyticsUIBuilders.js (526 lines)
Large file: ./submodules/music_in_numbers/src/scripts/analytics/AnalyticsValidators.js (470 lines)
Large file: ./submodules/music_in_numbers/src/scripts/analytics/AnalyticsProcessors.js (482 lines)
Large file: ./submodules/music_in_numbers/src/scripts/data-export.js (962 lines)
Large file: ./submodules/music_in_numbers/src/scripts/theme-manager.js (380 lines)
Large file: ./submodules/music_in_numbers/tests/artist-functions.test.js (408 lines)
Large file: ./submodules/music_in_numbers/tests/security-testing.test.js (1111 lines)
Large file: ./submodules/music_in_numbers/tests/security-testing.jest.test.js (649 lines)
Large file: ./submodules/music_in_numbers/tests/selenium/e2e/spotify-session-detection.test.js (452 lines)
Large file: ./submodules/music_in_numbers/tests/selenium/setup/page-objects/MusicInNumbersPage.js (397 lines)
Large file: ./submodules/music_in_numbers/tests/advanced-error-handling.jest.test.js (759 lines)
Large file: ./submodules/music_in_numbers/tests/analytics-core-patterns.jest.test.js (671 lines)
Large file: ./submodules/music_in_numbers/tests/spotify-auth-di.test.js (424 lines)
Large file: ./submodules/music_in_numbers/tests/advanced-error-handling.test.js (869 lines)
Large file: ./submodules/music_in_numbers/tests/performance-benchmarking.jest.test.js (495 lines)
Large file: ./submodules/music_in_numbers/tests/index-functions.jest.test.js (342 lines)
Large file: ./submodules/music_in_numbers/tests/data-export.test.js (346 lines)
Large file: ./submodules/music_in_numbers/tests/performance-benchmarking.test.js (1051 lines)
Large file: ./submodules/music_in_numbers/tests/index-functions.test.js (479 lines)
Large file: ./submodules/music_in_numbers/.github/DEPENDENCY_INJECTION_EXAMPLES.js (781 lines)
Large file: ./submodules/music_in_numbers/.github/CLASS_BASED_SPOTIFY_API_ARCHITECTURE.js (604 lines)
Naming issue: ./submodules/music_in_numbers/src/index_model.html (not kebab-case)
Naming issue: ./submodules/music_in_numbers/src/music_in_numbers.html (not kebab-case)
Naming issue: ./coverage/lcov-report/scripts/initialization/InitializationUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/timing/Chronometer.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/speech/SpeechQueue.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/speech/SpeechSynthesisManager.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/speech/SpeechItem.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/coordination/WebGeocodingManager.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/status/SingletonStatusManager.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/data/AddressDataExtractor.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/data/AddressExtractor.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/data/BrazilianStandardAddress.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/data/AddressCache.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/data/ReferencePlace.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/guia_ibge.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/html/HtmlText.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/html/HtmlSpeechSynthesisDisplayer.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/html/HTMLPositionDisplayer.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/html/DisplayerFactory.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/html/HTMLReferencePlaceDisplayer.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/html/HTMLAddressDisplayer.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/services/ReverseGeocoder.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/services/ChangeDetectionCoordinator.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/services/GeolocationService.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/core/GeoPosition.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/core/ObserverSubject.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/guia_turistico/src/libs/guia_js/src/core/PositionManager.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/App.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/pages/Home/Home.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/components/AdvancedSearchModal/AdvancedSearchModal.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/components/SearchForm/SearchForm.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/components/SearchForm/SearchFormHandler.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/components/ProgressBar/ProgressBar.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/components/QuickSearch/QuickSearch.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/monitora_vagas/src/js/noScrollInterface.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/data-export/DataExportProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/data-export/DataExportUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/data-export/VALIDATION_TEST.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/data-export/DataExportUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/data-export/DataExportCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/data-export/DataExportValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/initialization/InitializationUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/initialization/InitializationCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/initialization/InitializationUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/initialization/InitializationValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/initialization/InitializationProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/performance/PerformanceProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/performance/PerformanceUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/performance/PerformanceUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/performance/PerformanceValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/performance/PerformanceCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-ui/ArtistUICore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/ui-components/UIComponentsCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/ui-components/UIComponentsBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/ui-components/UIComponentsProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/ui-components/UIComponentsUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/ui-components/UIComponentsValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-page/ArtistPageProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-page/ArtistPageCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-page/ArtistPageUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-page/ArtistPageUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-page/ArtistPageValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/real-time/RealTimeUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/real-time/RealTimeValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/real-time/RealTimeCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/real-time/RealTimeUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/real-time/RealTimeProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/theme-manager/ThemeManagerUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-api/ArtistApiValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-api/ArtistApiUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-api/ArtistApiCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-api/ArtistApiUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/artist-api/ArtistApiProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/utils/UtilsBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/utils/UtilsCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/utils/UtilsUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/utils/UtilsValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/utils/UtilsProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/spotify-api/SpotifyApiValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/spotify-api/SpotifyApiUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/spotify-api/SpotifyApiRequestBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/spotify-api/SpotifyApiResponseProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/spotify-api/SpotifySessionDetector.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/analytics/AnalyticsUtilities.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/analytics/AnalyticsValidators.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/analytics/AnalyticsProcessors.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/analytics/AnalyticsUIBuilders.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/submodules/music_in_numbers/src/scripts/analytics/AnalyticsCore.js.html (not kebab-case)
Naming issue: ./coverage/lcov-report/guia_ibge.js.html (not kebab-case)
Function declarations: 19482
Module issue: ./scripts/initialization/InitializationUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/data-export/DataExportUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/ui-components.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/initialization.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/initialization/InitializationUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/utils.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/performance/PerformanceUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/artist-ui/ArtistUIUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/ui-components/UIComponentsUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/artist-page/ArtistPageUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/spotify-api.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/artist-api/ArtistApiUtilities.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/artist-api.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/data-export.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/src/scripts/theme-manager.js uses require() instead of import
Module issue: ./submodules/music_in_numbers/tests/selenium/e2e/spotify-session-detection.test.js uses require() instead of import
Code organization: JavaScript files spread across 2078 directories
```

---

**Generated by:** Tests & Documentation Workflow Automation v2.3.0
