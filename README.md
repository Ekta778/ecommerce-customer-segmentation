# Ecommerce Customer Segmentation

A sophisticated web application that performs advanced K-Means clustering analysis on customer data to identify strategic customer personas and unlock actionable insights for targeted marketing campaigns.

![Customer Analytics Suite](https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🚀 Live Demo

**[View Live Application](https://customerssegmentation.netlify.app/)**

## ✨ Features

### 🎯 Smart Customer Segmentation
- **Advanced K-Means Clustering**: Automatically identify customer segments using machine learning algorithms
- **Silhouette Score Validation**: Ensure clustering quality with statistical validation metrics
- **Optimal Cluster Detection**: Automatically determine the best number of clusters for your data

### 📊 Interactive Data Visualization
- **Dynamic Scatter Plots**: Visualize customer segments across any two features
- **Real-time Filtering**: Filter data by specific customer clusters
- **Responsive Charts**: Built with Recharts for smooth, interactive experiences
- **Custom Color Coding**: Each cluster gets a unique color for easy identification

### 🔍 Comprehensive Analytics
- **Customer Personas**: Detailed analysis of each customer segment with descriptive names
- **Statistical Summaries**: Average values and characteristics for each cluster
- **Cluster Size Analysis**: Visual representation of segment distributions
- **Export Functionality**: Download clustered results as CSV files

### 🎨 Production-Ready Design
- **Modern UI/UX**: Clean, professional interface built with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: User-friendly controls and clear visual hierarchy
- **Accessibility**: Built with accessibility best practices in mind

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts & Visualization**: Recharts for interactive data visualization
- **Machine Learning**: 
  - `ml-kmeans` for K-Means clustering algorithm
  - `ml-distance` for distance calculations and silhouette scoring
- **Data Processing**: PapaParse for CSV file handling
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds
- **Deployment**: Netlify for seamless hosting

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser with JavaScript enabled

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-customer-segmentation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

## 📊 Data Format Requirements

### CSV File Structure

Your CSV file should contain customer records with the following characteristics:

- **Header row**: First row should contain column names
- **Customer ID**: Include an `id` column or one will be auto-generated
- **Numeric columns**: At least 2 numeric columns are required for clustering analysis
- **Clean data**: Remove or handle missing values before upload

### Example CSV Format

```csv
customer_id,annual_spending,purchase_frequency,avg_order_value,customer_lifetime_value
CUST001,2500.50,12,208.75,5200.00
CUST002,1200.00,6,200.00,2400.00
CUST003,4500.75,24,187.53,9500.00
CUST004,800.25,3,266.75,1600.00
```

### Supported Column Types

- **Customer identifiers**: `customer_id`, `id`, `user_id`
- **Financial metrics**: `annual_spending`, `total_revenue`, `avg_order_value`
- **Behavioral data**: `purchase_frequency`, `days_since_last_purchase`
- **Engagement metrics**: `website_visits`, `email_opens`, `support_tickets`

## 🎯 How to Use

### 1. Upload Your Data
- Click the upload area or drag and drop your CSV file
- The system will automatically validate your data format
- Ensure you have at least 2 customers and 2 numeric columns

### 2. Analyze Clusters
- The application automatically determines the optimal number of clusters
- View the silhouette score to assess clustering quality (higher is better)
- Explore different cluster counts using the dropdown control

### 3. Visualize Results
- Select X and Y axis features to create custom scatter plots
- Each cluster is color-coded for easy identification
- Hover over data points to see detailed customer information

### 4. Explore Customer Personas
- Review automatically generated persona names and characteristics
- Analyze average values for each customer segment
- Use the cluster filter to focus on specific segments

### 5. Export Results
- Click "Export Results" to download your clustered data
- The CSV includes original data plus cluster assignments
- Use results for targeted marketing campaigns and customer strategies

## 📈 Understanding the Results

### Silhouette Score
- **Range**: -1 to 1
- **Good scores**: 0.5 to 1.0
- **Interpretation**: Higher scores indicate better-defined, more separated clusters

### Customer Personas
The application automatically generates descriptive names for each cluster:
- **High-Value Customers**: Top spenders with high engagement
- **Budget-Conscious**: Price-sensitive customers with lower spending
- **Frequent Buyers**: High purchase frequency, moderate spending
- **Occasional Shoppers**: Infrequent purchases, variable spending

## 🔧 Configuration

### Clustering Parameters
- **Maximum clusters**: Automatically limited to 8 or data size - 1
- **Algorithm**: K-Means with 100 maximum iterations
- **Normalization**: Min-max scaling applied to all numeric features
- **Distance metric**: Euclidean distance for cluster assignments

### Visualization Options
- **Feature selection**: Choose any numeric columns for X/Y axes
- **Color scheme**: Predefined color palette for consistent visualization
- **Interactive tooltips**: Detailed information on hover
- **Responsive design**: Adapts to different screen sizes

## 🚀 Deployment

### Netlify (Recommended)
The application is optimized for Netlify deployment:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Other Platforms
The application can be deployed to any static hosting service:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information about your problem
3. Include your CSV file structure and any error messages

## 🔮 Roadmap

- [ ] Support for additional clustering algorithms (DBSCAN, Hierarchical)
- [ ] Advanced data preprocessing options
- [ ] Machine learning model export functionality
- [ ] Integration with popular CRM systems
- [ ] Real-time data streaming capabilities
- [ ] Advanced statistical analysis features

## 📊 Performance

- **File size limit**: Recommended maximum 10MB CSV files
- **Processing time**: Typically under 5 seconds for 10,000 customers
- **Browser compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile support**: Fully responsive design for mobile devices

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
