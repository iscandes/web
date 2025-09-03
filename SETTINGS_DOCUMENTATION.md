# Settings Management System

## Overview
The Settings Management System provides comprehensive control over your website's configuration, appearance, and functionality. This system allows you to manage all aspects of your real estate website from a single interface.

## Features

### 🎛️ **Comprehensive Settings Categories**
- **General**: Basic site information and configuration
- **Site**: Website identity, branding, and core settings

- **Social**: Social media links and integration
- **SEO**: Search engine optimization settings
- **Analytics**: Tracking and analytics configuration
- **API**: API settings and integrations
- **Theme**: Visual appearance and branding
- **Security**: Security and authentication settings
- **Email**: Email configuration and notifications
- **Payment**: Payment processing settings
- **Media**: File upload and media handling
- **Performance**: Caching and optimization
- **Maintenance**: Maintenance mode and system health
- **Legal**: Privacy, terms, and compliance settings

### 🔧 **Setting Types**
- **Text**: Simple text values
- **Textarea**: Multi-line text content
- **Number**: Numeric values
- **Boolean**: True/false toggles
- **Email**: Email address validation
- **URL**: Website links with validation
- **Color**: Color picker with hex values
- **JSON**: Structured data configuration
- **Password**: Secure password fields
- **File**: File path references
- **Select**: Multiple choice options

### 📊 **Dashboard Features**
- Real-time statistics and metrics
- Category-based organization
- Advanced search and filtering
- Bulk operations and initialization
- Visual value rendering
- Public/private setting management

## Default Settings Included

### Site Configuration
- Site name, description, and tagline
- Logo and favicon paths


### Social Media Integration
- Facebook, Instagram, Twitter, LinkedIn
- YouTube and TikTok support
- Customizable social links

### SEO Optimization
- Meta keywords and descriptions
- Open Graph image settings
- Twitter card configuration
- Canonical URL management

### Theme Customization
- Primary, secondary, and accent colors
- Background and text colors
- Border and muted text styling
- Complete brand color palette

### Analytics & Tracking
- Google Analytics integration
- Facebook Pixel support
- Hotjar and GTM configuration
- Privacy-compliant tracking

### Email Configuration
- SMTP server settings
- Email templates and branding
- Notification preferences
- Automated email handling

### Payment Processing
- Multi-currency support
- Stripe and PayPal integration
- Secure payment handling
- Transaction management

### Media Management
- File size and type restrictions
- Image optimization settings
- Video and document handling
- CDN configuration

### Performance Optimization
- Caching configuration
- Compression settings
- Lazy loading options
- CDN integration

### Security Features
- Two-factor authentication
- Session management
- Login attempt limits
- CAPTCHA integration

### Legal Compliance
- Privacy policy links
- Terms of service
- Cookie consent management
- GDPR compliance tools

## API Endpoints

### GET `/api/admin/settings`
Retrieve all settings in array format for the admin interface.

### PUT `/api/admin/settings/[id]`
Update an individual setting by ID.

### POST `/api/admin/settings/create`
Create a new custom setting.

### DELETE `/api/admin/settings/[id]`
Reset a setting to its default value.

### POST `/api/admin/settings/initialize`
Initialize all default settings for a new installation.

## Usage Examples

### Creating a Custom Setting
```javascript
const newSetting = {
  key: 'custom_feature_enabled',
  value: 'true',
  type: 'boolean',
  category: 'general',
  label: 'Enable Custom Feature',
  description: 'Toggle the custom feature on or off',
  isPublic: false
};
```

### Updating Theme Colors
```javascript
const themeUpdate = {
  key: 'theme.primaryColor',
  value: '#FF6B35',
  type: 'color',
  category: 'theme',
  label: 'Primary Brand Color',
  description: 'Main color used throughout the website'
};
```

### Configuring Social Media
```javascript
const socialSetting = {
  key: 'social.instagram',
  value: 'https://instagram.com/yourcompany',
  type: 'url',
  category: 'social',
  label: 'Instagram URL',
  description: 'Link to your Instagram profile'
};
```

## Best Practices

1. **Use Descriptive Keys**: Choose clear, hierarchical keys like `contact.email` or `theme.primaryColor`
2. **Categorize Properly**: Organize settings into logical categories for better management
3. **Validate Input**: Use appropriate types to ensure data integrity
4. **Document Changes**: Provide clear labels and descriptions for all settings
5. **Test Thoroughly**: Always test setting changes in a development environment first
6. **Backup Settings**: Export settings before making major changes
7. **Monitor Performance**: Keep track of how settings affect site performance

## Security Considerations

- Password fields are automatically masked in the interface
- Sensitive settings should not be marked as public
- API keys and secrets should use the password type
- Regular security audits of public settings are recommended
- Access to settings management should be restricted to administrators

## Troubleshooting

### Common Issues
1. **Settings not saving**: Check API endpoint connectivity
2. **Invalid JSON**: Validate JSON syntax before saving
3. **Color not displaying**: Ensure hex color format (#RRGGBB)
4. **URL validation errors**: Check for proper protocol (http/https)

### Support
For technical support or feature requests, contact the development team or refer to the project documentation.