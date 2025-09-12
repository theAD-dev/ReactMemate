# SunEditor Component

A reusable, feature-rich text editor component built with SunEditor for React applications with S3 image upload support.

## Features

- ✅ **Rich Text Formatting**: Bold, italic, underline, strikethrough
- ✅ **Table Support**: Insert and edit tables with proper styling
- ✅ **Lists**: Ordered and unordered lists
- ✅ **Alignment**: Left, center, right, justify
- ✅ **Links and Images**: Insert and manage links and images
- ✅ **S3 Image Upload**: Upload images directly to S3 with progress tracking
- ✅ **Drag & Drop**: Drag and drop images for upload
- ✅ **Code View**: Switch between WYSIWYG and code view
- ✅ **Customizable**: Highly configurable options
- ✅ **TypeScript Support**: Full PropTypes validation

## Installation

The component requires `suneditor`, `suneditor-react`, `axios`, and `sonner` packages:

```bash
npm install suneditor suneditor-react axios sonner
```

## Basic Usage

```jsx
import { SunEditorComponent } from '../shared/ui/editor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <SunEditorComponent
      value={content}
      onChange={setContent}
      placeholder="Enter your content..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Current content of the editor |
| `onChange` | `function` | - | Callback when content changes |
| `placeholder` | `string` | `'Enter content...'` | Placeholder text |
| `height` | `number` | `299` | Height in pixels |
| `showTable` | `boolean` | `true` | Show table button in toolbar |
| `showImage` | `boolean` | `true` | Show image button in toolbar |
| `showLink` | `boolean` | `true` | Show link button in toolbar |
| `showCodeView` | `boolean` | `true` | Show code view button |
| `disabled` | `boolean` | `false` | Disable the editor |
| `className` | `string` | `''` | Additional CSS class |
| `customOptions` | `object` | `{}` | Custom SunEditor options |
| `onLoad` | `function` | - | Callback when editor loads |
| `onFocus` | `function` | - | Callback when editor gains focus |
| `onBlur` | `function` | - | Callback when editor loses focus |
| `enableS3Upload` | `boolean` | `false` | Enable S3 image upload functionality |
| `s3UploadEndpoint` | `string` | - | Custom S3 upload endpoint URL |
| `uploadId` | `string/number` | - | Upload ID for S3 endpoint |

## S3 Image Upload

The component supports direct image upload to S3 with the following features:

- **File validation**: Automatically validates file size (max 10MB) and type (images only)
- **Progress tracking**: Shows upload progress with visual indicators
- **Drag & drop**: Drag and drop images directly onto the editor
- **Error handling**: Displays error messages for failed uploads
- **Automatic insertion**: Images are automatically inserted into the editor after upload

### Setting up S3 Upload

To enable S3 upload functionality:

```jsx
<SunEditorComponent
  value={content}
  onChange={setContent}
  enableS3Upload={true}
  uploadId="your-upload-id"
  s3UploadEndpoint="/custom/upload/endpoint" // Optional
/>
```

The component expects your backend to provide a signed URL endpoint that returns:

```json
{
  "url": "https://your-s3-bucket.s3.amazonaws.com/path/to/file?signed-params"
}
```

## Advanced Usage

### Custom Configuration

```jsx
<SunEditorComponent
  value={content}
  onChange={setContent}
  height={400}
  showTable={true}
  showImage={false}
  customOptions={{
    buttonList: [
      ['bold', 'italic'],
      ['table'],
      ['link']
    ],
    formats: ['p', 'h1', 'h2', 'h3']
  }}
/>
```

### Minimal Editor

```jsx
<SunEditorComponent
  value={content}
  onChange={setContent}
  showTable={false}
  showImage={false}
  showCodeView={false}
  customOptions={{
    buttonList: [
      ['bold', 'italic', 'underline']
    ]
  }}
/>
```

### With S3 Upload

```jsx
<SunEditorComponent
  value={content}
  onChange={setContent}
  enableS3Upload={true}
  uploadId="proposal-123"
  height={400}
  showTable={true}
/>
```

### Drag & Drop Upload

```jsx
function ProposalEditor() {
  const [content, setContent] = useState('');

  return (
    <SunEditorComponent
      value={content}
      onChange={setContent}
      enableS3Upload={true}
      uploadId="proposal-123"
      placeholder="Write your proposal... (You can drag and drop images here)"
    />
  );
}
```

## Table Features

The editor includes comprehensive table functionality:

- Insert tables with custom rows/columns
- Add/remove rows and columns
- Merge/split cells
- Professional styling with borders and padding
- Header row styling

## Styling

The component includes default styling for tables:

- **Headers**: Gray background with bold text
- **Cells**: White background with borders and padding
- **Responsive**: Adapts to container width

## Examples

### Form Integration

```jsx
function ProposalForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  return (
    <form>
      <input
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Title"
      />
      
      <SunEditorComponent
        value={formData.description}
        onChange={(content) => setFormData({...formData, description: content})}
        placeholder="Enter proposal description..."
        height={400}
      />
    </form>
  );
}
```

### Read-only Mode

```jsx
<SunEditorComponent
  value={readOnlyContent}
  disabled={true}
  showTable={false}
  showImage={false}
  customOptions={{
    buttonList: []
  }}
/>
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Dependencies

- `react` 16.8+
- `suneditor` 2.44.0+
- `suneditor-react` 3.4.0+
- `prop-types` (for development)
