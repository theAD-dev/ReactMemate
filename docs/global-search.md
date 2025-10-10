# Global Search System

A professional, scalable, and maintainable global search implementation for the ReactMemate application.

## Features

### 🔍 **Search Capabilities**
- **Projects**: Search by Reference, Project Number, Client Name
- **Clients**: Search by Client Name, Contact Person, Email, Phone
- **Real-time Search**: 300ms debounced search with instant results
- **Professional UI**: Modern dropdown design with smooth animations

### 🎨 **Design Features**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: High contrast mode support, keyboard navigation
- **Dark Mode Ready**: CSS variables for easy theming
- **Loading States**: Professional loading indicators
- **Empty States**: Helpful messages for no results

### ⚡ **Performance Features**
- **Debounced Search**: Prevents excessive API calls
- **Lazy Loading**: Results load only when needed
- **Efficient Rendering**: Optimized React rendering
- **Memory Management**: Proper cleanup of event listeners

## Architecture

### 📁 **File Structure**
```
src/
├── APIs/
│   └── global-search-api.js          # Search API functions
├── shared/
│   ├── hooks/
│   │   └── useGlobalSearch.js         # Custom search hook
│   ├── utils/
│   │   └── search-formatters.js       # Data formatting utilities
│   └── ui/header/components/
│       ├── global-search.jsx          # Main component
│       └── global-search.module.scss  # Component styles
```

### 🏗️ **Components**

#### **GlobalSearch Component**
- Main search interface component
- Handles user interactions and navigation
- Manages dropdown state and event listeners

#### **useGlobalSearch Hook**
- Reusable search logic
- Debounced input handling
- State management for search results

#### **Search API Functions**
- `performUnifiedSearch()`: Search across all entities
- `searchProjects()`: Project-specific search
- `searchClients()`: Client-specific search

## Usage

### Basic Implementation
```jsx
import GlobalSearch from './shared/ui/header/components/global-search';

// In your header component
<GlobalSearch />
```

### Custom Hook Usage
```jsx
import { useGlobalSearch } from './shared/hooks/useGlobalSearch';

const MySearchComponent = () => {
    const {
        inputValue,
        setInputValue,
        searchResults,
        loading
    } = useGlobalSearch();

    return (
        <div>
            <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {loading && <div>Searching...</div>}
            {/* Render results */}
        </div>
    );
};
```

## API Endpoints

### Expected API Structure

#### **Projects Search**
```
GET /api/management/?search={query}&limit=10&offset=0
Response: {
    count: number,
    results: [
        {
            id: number,
            reference: string,
            project_number: string,
            status: string,
            client_name: string
        }
    ]
}
```

#### **Clients Search**
```
GET /api/clients/?search={query}&limit=10&offset=0
Response: {
    count: number,
    results: [
        {
            id: number,
            name: string,
            business_name: string,
            contact_person: string,
            email: string,
            phone: string,
            type: string,
            photo: string,
            has_photo: boolean
        }
    ]
}
```

## Customization

### 🎨 **Styling**
The component uses CSS modules for styling. Key customization points:

```scss
// global-search.module.scss
.searchDropdown {
    width: 480px; // Adjust dropdown width
    max-height: 600px; // Adjust max height
}

.searchInput {
    padding: 12px 40px; // Adjust input padding
    border-radius: 8px; // Adjust border radius
}
```

### 🔧 **Search Configuration**
```javascript
// In useGlobalSearch.js
const [inputValue, debouncedValue, setInputValue] = useDebounce('', 300); // Adjust debounce time

// In global-search-api.js
export const performUnifiedSearch = async (query, limit = 5) => {
    // Adjust default result limit
}
```

### 🎯 **Adding New Search Types**
1. **Add API function**:
```javascript
// In global-search-api.js
export const searchNewEntity = async (query, limit = 10) => {
    // Implementation
};
```

2. **Update unified search**:
```javascript
// Add to performUnifiedSearch function
const newEntityResponse = await searchNewEntity(query, limit);
return {
    projects: projectsResponse.results || [],
    clients: clientsResponse.results || [],
    newEntity: newEntityResponse.results || [], // Add new entity
    total: // Update total calculation
};
```

3. **Add formatter**:
```javascript
// In search-formatters.js
export const formatNewEntityResult = (entity) => ({
    // Formatting logic
});
```

4. **Update component**:
```jsx
// In global-search.jsx
{searchResults.newEntity.length > 0 && (
    <div className={searchStyle.resultSection}>
        {/* Render new entity results */}
    </div>
)}
```

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Accessibility**: Screen readers, keyboard navigation
- **Performance**: 60fps animations, <100ms interaction response

## Best Practices

### 🚀 **Performance**
- Use debounced search to minimize API calls
- Implement result caching if needed
- Lazy load additional data on demand

### ♿ **Accessibility**
- Provide keyboard navigation (Arrow keys, Enter, Escape)
- Use proper ARIA labels and roles
- Ensure high contrast mode compatibility

### 🔒 **Security**
- Sanitize search inputs
- Implement rate limiting on backend
- Use proper authentication for API calls

### 🧪 **Testing**
```javascript
// Example test structure
describe('GlobalSearch', () => {
    test('should perform search on input', () => {
        // Test implementation
    });
    
    test('should navigate on result selection', () => {
        // Test implementation
    });
});
```

## Future Enhancements

1. **Search History**: Store and suggest recent searches
2. **Advanced Filters**: Add category, date, and status filters
3. **Keyboard Shortcuts**: Global hotkeys (Ctrl+K, Cmd+K)
4. **Search Analytics**: Track popular searches and optimize
5. **Voice Search**: Add speech-to-text functionality
6. **Offline Support**: Cache recent results for offline access

## Troubleshooting

### Common Issues

1. **Search not working**:
   - Check API endpoints are accessible
   - Verify authentication tokens
   - Check console for errors

2. **Dropdown not appearing**:
   - Check z-index conflicts
   - Verify CSS module imports
   - Check click event handlers

3. **Navigation not working**:
   - Verify route paths exist
   - Check React Router configuration
   - Ensure proper permissions

### Debug Mode
Add to localStorage to enable debug logging:
```javascript
localStorage.setItem('globalSearch:debug', 'true');
```