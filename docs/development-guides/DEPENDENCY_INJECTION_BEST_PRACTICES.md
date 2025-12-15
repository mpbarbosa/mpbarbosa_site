# Dependency Injection Best Practices Guide

## Table of Contents
- [Overview](#overview)
- [Core Principles](#core-principles)
- [JavaScript/ES6 Implementation Patterns](#javascriptes6-implementation-patterns)
- [Framework-Specific Patterns](#framework-specific-patterns)
- [Testing with Dependency Injection](#testing-with-dependency-injection)
- [Common Anti-Patterns](#common-anti-patterns)
- [Project-Specific Examples](#project-specific-examples)
- [Performance Considerations](#performance-considerations)
- [Best Practices Checklist](#best-practices-checklist)

## Overview

Dependency Injection (DI) is a design pattern that implements Inversion of Control (IoC) for resolving dependencies. Instead of objects creating their own dependencies, external entities provide them, leading to more modular, testable, and maintainable code.

### Benefits
- **Testability**: Easy to mock dependencies for unit testing
- **Modularity**: Loose coupling between components
- **Flexibility**: Easy to swap implementations
- **Maintainability**: Clear separation of concerns
- **Scalability**: Better architecture for growing applications

## Core Principles

### 1. Inversion of Control (IoC)
```javascript
// ❌ Bad: Hard dependency
class UserService {
    constructor() {
        this.httpClient = new HttpClient(); // Tight coupling
        this.logger = new ConsoleLogger();
    }
}

// ✅ Good: Dependency injection
class UserService {
    constructor(httpClient, logger) {
        this.httpClient = httpClient;
        this.logger = logger;
    }
}
```

### 2. Dependency Inversion Principle
```javascript
// ❌ Bad: Depends on concrete implementation
class EmailService {
    constructor() {
        this.smtpClient = new SmtpClient(); // Concrete dependency
    }
}

// ✅ Good: Depends on abstraction
class EmailService {
    constructor(emailProvider) { // Abstract interface
        this.emailProvider = emailProvider;
    }
}
```

### 3. Single Responsibility
```javascript
// ❌ Bad: Multiple responsibilities
class UserController {
    constructor() {
        this.database = new Database();
        this.emailService = new EmailService();
        this.validator = new Validator();
        this.logger = new Logger();
    }
    
    createUser(userData) {
        // Validation, database ops, email, logging all mixed
    }
}

// ✅ Good: Focused responsibility
class UserController {
    constructor(userService, logger) {
        this.userService = userService; // Handles business logic
        this.logger = logger; // Handles logging
    }
    
    async createUser(userData) {
        try {
            const user = await this.userService.create(userData);
            this.logger.info('User created successfully', { userId: user.id });
            return user;
        } catch (error) {
            this.logger.error('User creation failed', error);
            throw error;
        }
    }
}
```

## JavaScript/ES6 Implementation Patterns

### 1. Constructor Injection
```javascript
class SpotifyApiService {
    constructor(httpClient, tokenManager, rateLimiter) {
        this.httpClient = httpClient;
        this.tokenManager = tokenManager;
        this.rateLimiter = rateLimiter;
    }
    
    async getArtist(artistId) {
        await this.rateLimiter.checkLimit();
        const token = await this.tokenManager.getValidToken();
        return this.httpClient.get(`/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}
```

### 2. Factory Pattern with DI
```javascript
class ServiceFactory {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    
    createSpotifyService() {
        return new SpotifyApiService(
            this.dependencies.httpClient,
            this.dependencies.tokenManager,
            this.dependencies.rateLimiter
        );
    }
    
    createAnalyticsService() {
        return new AnalyticsService(
            this.dependencies.dataProcessor,
            this.dependencies.chartRenderer
        );
    }
}
```

### 3. Simple DI Container
```javascript
class DIContainer {
    constructor() {
        this.services = new Map();
        this.factories = new Map();
    }
    
    register(name, factory, singleton = true) {
        this.factories.set(name, { factory, singleton });
        if (!singleton) {
            this.services.delete(name);
        }
    }
    
    resolve(name) {
        if (this.services.has(name)) {
            return this.services.get(name);
        }
        
        const serviceConfig = this.factories.get(name);
        if (!serviceConfig) {
            throw new Error(`Service ${name} not registered`);
        }
        
        const service = serviceConfig.factory(this);
        
        if (serviceConfig.singleton) {
            this.services.set(name, service);
        }
        
        return service;
    }
}

// Usage
const container = new DIContainer();

container.register('httpClient', () => new HttpClient());
container.register('tokenManager', (c) => new TokenManager(c.resolve('httpClient')));
container.register('spotifyService', (c) => new SpotifyApiService(
    c.resolve('httpClient'),
    c.resolve('tokenManager'),
    c.resolve('rateLimiter')
));
```

### 4. Module-Based DI
```javascript
// dependencies.js
export const createDependencies = () => {
    const httpClient = new HttpClient();
    const logger = new Logger();
    const tokenManager = new TokenManager(httpClient, logger);
    
    return {
        httpClient,
        logger,
        tokenManager,
        spotifyService: new SpotifyApiService(httpClient, tokenManager, logger)
    };
};

// main.js
import { createDependencies } from './dependencies.js';

const deps = createDependencies();
const app = new App(deps.spotifyService, deps.logger);
```

## Framework-Specific Patterns

### React with Context API
```javascript
// DependencyContext.js
import React, { createContext, useContext } from 'react';

const DependencyContext = createContext();

export const DependencyProvider = ({ children, services }) => (
    <DependencyContext.Provider value={services}>
        {children}
    </DependencyContext.Provider>
);

export const useDependencies = () => {
    const context = useContext(DependencyContext);
    if (!context) {
        throw new Error('useDependencies must be used within DependencyProvider');
    }
    return context;
};

// Component usage
const MusicAnalytics = () => {
    const { spotifyService, analyticsService } = useDependencies();
    
    useEffect(() => {
        const loadData = async () => {
            const data = await spotifyService.getUserTopTracks();
            analyticsService.processData(data);
        };
        loadData();
    }, [spotifyService, analyticsService]);
};
```

### Node.js with Express
```javascript
// container.js
class ExpressContainer {
    constructor() {
        this.services = new Map();
    }
    
    register(name, factory) {
        this.services.set(name, factory);
    }
    
    resolve(name) {
        const factory = this.services.get(name);
        if (!factory) {
            throw new Error(`Service ${name} not found`);
        }
        return factory(this);
    }
}

// app.js
const container = new ExpressContainer();

// Register services
container.register('database', () => new Database(process.env.DATABASE_URL));
container.register('userService', (c) => new UserService(c.resolve('database')));
container.register('userController', (c) => new UserController(c.resolve('userService')));

// Middleware to inject container
app.use((req, res, next) => {
    req.container = container;
    next();
});

// Route with DI
app.get('/users', (req, res) => {
    const userController = req.container.resolve('userController');
    userController.getUsers(req, res);
});
```

## Testing with Dependency Injection

### 1. Mock Injection
```javascript
// UserService.test.js
import { jest } from '@jest/globals';
import { UserService } from '../UserService.js';

describe('UserService', () => {
    let mockDatabase;
    let mockLogger;
    let userService;
    
    beforeEach(() => {
        mockDatabase = {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn()
        };
        
        mockLogger = {
            info: jest.fn(),
            error: jest.fn()
        };
        
        userService = new UserService(mockDatabase, mockLogger);
    });
    
    test('should create user successfully', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com' };
        const expectedUser = { id: 1, ...userData };
        
        mockDatabase.create.mockResolvedValue(expectedUser);
        
        const result = await userService.createUser(userData);
        
        expect(mockDatabase.create).toHaveBeenCalledWith(userData);
        expect(mockLogger.info).toHaveBeenCalledWith(
            'User created successfully',
            { userId: 1 }
        );
        expect(result).toEqual(expectedUser);
    });
});
```

### 2. Test Doubles Factory
```javascript
// testDoubles.js
export const createTestDoubles = () => ({
    httpClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    },
    
    tokenManager: {
        getValidToken: jest.fn().mockResolvedValue('mock-token'),
        refreshToken: jest.fn(),
        isExpired: jest.fn().mockReturnValue(false)
    },
    
    rateLimiter: {
        checkLimit: jest.fn().mockResolvedValue(true),
        getRemainingCalls: jest.fn().mockReturnValue(100)
    }
});

// SpotifyService.test.js
import { createTestDoubles } from '../testDoubles.js';
import { SpotifyApiService } from '../SpotifyApiService.js';

describe('SpotifyApiService', () => {
    test('should fetch artist data', async () => {
        const mocks = createTestDoubles();
        const service = new SpotifyApiService(
            mocks.httpClient,
            mocks.tokenManager,
            mocks.rateLimiter
        );
        
        const mockArtist = { id: '123', name: 'Test Artist' };
        mocks.httpClient.get.mockResolvedValue({ data: mockArtist });
        
        const result = await service.getArtist('123');
        
        expect(mocks.rateLimiter.checkLimit).toHaveBeenCalled();
        expect(mocks.tokenManager.getValidToken).toHaveBeenCalled();
        expect(mocks.httpClient.get).toHaveBeenCalledWith('/artists/123', {
            headers: { Authorization: 'Bearer mock-token' }
        });
        expect(result.data).toEqual(mockArtist);
    });
});
```

## Common Anti-Patterns

### 1. Service Locator Anti-Pattern
```javascript
// ❌ Bad: Service Locator
class UserController {
    constructor() {
        // Hidden dependencies
    }
    
    createUser(userData) {
        const userService = ServiceLocator.get('userService'); // Hidden dependency
        const logger = ServiceLocator.get('logger'); // Not obvious what this class needs
        return userService.create(userData);
    }
}

// ✅ Good: Explicit dependencies
class UserController {
    constructor(userService, logger) { // Clear what this class needs
        this.userService = userService;
        this.logger = logger;
    }
    
    createUser(userData) {
        return this.userService.create(userData);
    }
}
```

### 2. Constructor Over-Injection
```javascript
// ❌ Bad: Too many dependencies
class AnalyticsService {
    constructor(
        httpClient,
        database,
        cache,
        logger,
        emailService,
        smsService,
        slackService,
        metricsService,
        configService,
        validationService
    ) {
        // 10+ dependencies indicate design issues
    }
}

// ✅ Good: Grouped related dependencies
class AnalyticsService {
    constructor(dataProvider, notificationService, metricsCollector) {
        this.dataProvider = dataProvider; // Wraps httpClient, database, cache
        this.notificationService = notificationService; // Wraps email, SMS, Slack
        this.metricsCollector = metricsCollector; // Wraps metrics, logging
    }
}
```

### 3. Temporal Coupling
```javascript
// ❌ Bad: Order-dependent initialization
class SpotifyService {
    constructor() {
        this.httpClient = new HttpClient();
        this.tokenManager = new TokenManager();
        this.init(); // Must be called after construction
    }
    
    init() {
        this.tokenManager.setHttpClient(this.httpClient); // Order matters
    }
}

// ✅ Good: Complete initialization in constructor
class SpotifyService {
    constructor(httpClient, tokenManager) {
        this.httpClient = httpClient;
        this.tokenManager = tokenManager;
        // All dependencies ready to use immediately
    }
}
```

## Project-Specific Examples

### Music in Numbers - Spotify Integration
```javascript
// spotify-di-container.js
export class SpotifyDIContainer {
    constructor(config) {
        this.config = config;
        this.services = new Map();
    }
    
    createHttpClient() {
        return new HttpClient({
            baseURL: 'https://api.spotify.com/v1',
            timeout: this.config.requestTimeout || 10000,
            retries: this.config.maxRetries || 3
        });
    }
    
    createTokenManager() {
        return new TokenManager({
            clientId: this.config.spotify.clientId,
            clientSecret: this.config.spotify.clientSecret,
            redirectUri: this.config.spotify.redirectUri,
            httpClient: this.resolve('httpClient')
        });
    }
    
    createRateLimiter() {
        return new RateLimiter({
            maxRequests: 100,
            windowMs: 60000, // 1 minute
            storage: this.resolve('cache')
        });
    }
    
    createSpotifyApiService() {
        return new SpotifyApiService(
            this.resolve('httpClient'),
            this.resolve('tokenManager'),
            this.resolve('rateLimiter'),
            this.resolve('logger')
        );
    }
    
    createAnalyticsService() {
        return new AnalyticsService(
            this.resolve('spotifyApiService'),
            this.resolve('dataProcessor'),
            this.resolve('chartRenderer')
        );
    }
    
    resolve(serviceName) {
        if (this.services.has(serviceName)) {
            return this.services.get(serviceName);
        }
        
        const methodName = `create${serviceName.charAt(0).toUpperCase()}${serviceName.slice(1)}`;
        if (typeof this[methodName] === 'function') {
            const service = this[methodName]();
            this.services.set(serviceName, service);
            return service;
        }
        
        throw new Error(`Service ${serviceName} not found`);
    }
}
```

### Theme Manager with DI
```javascript
// theme-manager.js
export class ThemeManager {
    constructor(storage, cssInjector, eventEmitter) {
        this.storage = storage;
        this.cssInjector = cssInjector;
        this.eventEmitter = eventEmitter;
        this.currentTheme = null;
    }
    
    async initializeTheme() {
        const savedTheme = await this.storage.get('selectedTheme');
        const theme = savedTheme || 'light';
        await this.setTheme(theme);
    }
    
    async setTheme(themeName) {
        const themeData = await this.loadTheme(themeName);
        this.cssInjector.injectCSS(themeData.css);
        await this.storage.set('selectedTheme', themeName);
        
        this.currentTheme = themeName;
        this.eventEmitter.emit('themeChanged', { theme: themeName, data: themeData });
    }
}

// Dependencies
class LocalStorageWrapper {
    async get(key) {
        return localStorage.getItem(key);
    }
    
    async set(key, value) {
        localStorage.setItem(key, value);
    }
}

class CSSInjector {
    injectCSS(cssText) {
        const styleElement = document.createElement('style');
        styleElement.textContent = cssText;
        document.head.appendChild(styleElement);
    }
}

// Usage
const themeManager = new ThemeManager(
    new LocalStorageWrapper(),
    new CSSInjector(),
    new EventEmitter()
);
```

## Performance Considerations

### 1. Lazy Loading
```javascript
class LazyServiceContainer {
    constructor() {
        this.factories = new Map();
        this.instances = new Map();
    }
    
    register(name, factory, options = {}) {
        this.factories.set(name, {
            factory,
            singleton: options.singleton !== false,
            lazy: options.lazy !== false
        });
    }
    
    resolve(name) {
        const config = this.factories.get(name);
        if (!config) {
            throw new Error(`Service ${name} not found`);
        }
        
        if (config.singleton && this.instances.has(name)) {
            return this.instances.get(name);
        }
        
        const instance = config.factory(this);
        
        if (config.singleton) {
            this.instances.set(name, instance);
        }
        
        return instance;
    }
}
```

### 2. Circular Dependency Detection
```javascript
class SafeDIContainer {
    constructor() {
        this.services = new Map();
        this.factories = new Map();
        this.resolving = new Set();
    }
    
    resolve(name) {
        if (this.resolving.has(name)) {
            throw new Error(`Circular dependency detected: ${name}`);
        }
        
        if (this.services.has(name)) {
            return this.services.get(name);
        }
        
        this.resolving.add(name);
        
        try {
            const factory = this.factories.get(name);
            if (!factory) {
                throw new Error(`Service ${name} not registered`);
            }
            
            const service = factory(this);
            this.services.set(name, service);
            return service;
        } finally {
            this.resolving.delete(name);
        }
    }
}
```

### 3. Memory Management
```javascript
class ManagedDIContainer {
    constructor() {
        this.services = new Map();
        this.disposables = new Set();
    }
    
    register(name, factory, options = {}) {
        this.factories.set(name, { factory, ...options });
    }
    
    resolve(name) {
        const service = this.createService(name);
        
        // Track disposable services
        if (service && typeof service.dispose === 'function') {
            this.disposables.add(service);
        }
        
        return service;
    }
    
    dispose() {
        // Clean up all disposable services
        for (const service of this.disposables) {
            try {
                service.dispose();
            } catch (error) {
                console.error('Error disposing service:', error);
            }
        }
        
        this.services.clear();
        this.disposables.clear();
    }
}
```

## Best Practices Checklist

### ✅ Design Principles
- [ ] Follow Inversion of Control principle
- [ ] Apply Dependency Inversion Principle
- [ ] Maintain Single Responsibility for each service
- [ ] Use interfaces/contracts for loose coupling
- [ ] Avoid Service Locator anti-pattern

### ✅ Implementation
- [ ] Use constructor injection as primary method
- [ ] Keep constructors simple and focused
- [ ] Avoid circular dependencies
- [ ] Implement proper error handling
- [ ] Consider lazy loading for performance

### ✅ Testing
- [ ] Design for testability from the start
- [ ] Use mock objects for unit testing
- [ ] Create test doubles factory
- [ ] Test both success and error scenarios
- [ ] Verify dependency interactions

### ✅ Architecture
- [ ] Group related dependencies into facades
- [ ] Limit constructor parameters (max 5-7)
- [ ] Use factory pattern for complex object creation
- [ ] Implement proper lifecycle management
- [ ] Consider using DI container for large applications

### ✅ Performance
- [ ] Implement singleton pattern where appropriate
- [ ] Use lazy loading for expensive services
- [ ] Monitor memory usage and implement cleanup
- [ ] Detect and prevent circular dependencies
- [ ] Consider async initialization for I/O heavy services

### ✅ Documentation
- [ ] Document service contracts and interfaces
- [ ] Provide clear examples of service usage
- [ ] Document dependency relationships
- [ ] Maintain architecture decision records
- [ ] Update documentation when refactoring

## Conclusion

Dependency Injection is a powerful pattern that significantly improves code quality, testability, and maintainability. When implemented correctly, it leads to more modular applications that are easier to test, debug, and extend.

The key to successful DI implementation is starting with clear interfaces, keeping dependencies explicit, and maintaining a balance between flexibility and complexity. Remember that DI is a tool to solve specific problems—use it when it adds value, not just for the sake of using a pattern.

For the Music in Numbers project, DI has been particularly valuable in:
- Making Spotify API integration testable
- Creating flexible theme management
- Enabling easy swapping of data sources
- Simplifying component testing
- Supporting modular architecture

---

*This guide is part of the mpbarbosa_site project documentation. For project-specific examples and implementation details, refer to the source code in the `src/` directory.*