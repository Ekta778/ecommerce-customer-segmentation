import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import io
import base64

# Page configuration
st.set_page_config(
    page_title="Customer Segmentation Analytics",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f2937;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #6b7280;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    .cluster-card {
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.5rem 0;
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .upload-section {
        border: 2px dashed #d1d5db;
        border-radius: 10px;
        padding: 2rem;
        text-align: center;
        margin: 1rem 0;
        background: #f9fafb;
    }
</style>
""", unsafe_allow_html=True)

def load_sample_data():
    """Load sample customer data"""
    np.random.seed(42)
    n_customers = 200
    
    # Generate synthetic customer data
    data = {
        'customer_id': [f'CUST{i:03d}' for i in range(1, n_customers + 1)],
        'annual_spending': np.random.normal(15000, 5000, n_customers).clip(1000, 50000),
        'purchase_frequency': np.random.poisson(30, n_customers).clip(1, 100),
        'avg_order_value': np.random.normal(250, 75, n_customers).clip(50, 500),
        'customer_lifetime_value': np.random.normal(25000, 8000, n_customers).clip(2000, 80000),
        'days_since_last_purchase': np.random.exponential(15, n_customers).clip(1, 365)
    }
    
    return pd.DataFrame(data)

def normalize_data(df, numeric_columns):
    """Normalize numeric data for clustering"""
    scaler = StandardScaler()
    normalized_data = scaler.fit_transform(df[numeric_columns])
    return normalized_data, scaler

def perform_clustering(data, n_clusters):
    """Perform K-means clustering"""
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(data)
    
    # Calculate silhouette score
    if len(np.unique(clusters)) > 1:
        silhouette_avg = silhouette_score(data, clusters)
    else:
        silhouette_avg = 0
    
    return clusters, kmeans, silhouette_avg

def find_optimal_clusters(data, max_clusters=8):
    """Find optimal number of clusters using silhouette score"""
    silhouette_scores = []
    cluster_range = range(2, min(max_clusters + 1, len(data)))
    
    for n_clusters in cluster_range:
        clusters, _, score = perform_clustering(data, n_clusters)
        silhouette_scores.append(score)
    
    optimal_clusters = cluster_range[np.argmax(silhouette_scores)]
    return optimal_clusters, list(cluster_range), silhouette_scores

def generate_cluster_insights(df, clusters, numeric_columns):
    """Generate insights for each cluster"""
    df_with_clusters = df.copy()
    df_with_clusters['cluster'] = clusters
    
    cluster_names = [
        'High-Value Customers',
        'Budget-Conscious',
        'Frequent Buyers',
        'Occasional Shoppers',
        'Premium Seekers',
        'Deal Hunters',
        'Loyal Customers',
        'New Customers'
    ]
    
    cluster_colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
    ]
    
    insights = []
    for cluster_id in sorted(df_with_clusters['cluster'].unique()):
        cluster_data = df_with_clusters[df_with_clusters['cluster'] == cluster_id]
        
        characteristics = {}
        for col in numeric_columns:
            characteristics[col] = cluster_data[col].mean()
        
        insights.append({
            'cluster_id': cluster_id,
            'name': cluster_names[cluster_id % len(cluster_names)],
            'color': cluster_colors[cluster_id % len(cluster_colors)],
            'count': len(cluster_data),
            'percentage': len(cluster_data) / len(df_with_clusters) * 100,
            'characteristics': characteristics
        })
    
    return insights

def create_scatter_plot(df, clusters, x_col, y_col, insights):
    """Create interactive scatter plot"""
    df_plot = df.copy()
    df_plot['cluster'] = clusters
    df_plot['cluster_name'] = df_plot['cluster'].map({
        insight['cluster_id']: insight['name'] for insight in insights
    })
    
    fig = px.scatter(
        df_plot, 
        x=x_col, 
        y=y_col,
        color='cluster_name',
        hover_data=['customer_id'],
        title=f'{x_col.replace("_", " ").title()} vs {y_col.replace("_", " ").title()}',
        color_discrete_map={
            insight['name']: insight['color'] for insight in insights
        }
    )
    
    fig.update_layout(
        height=500,
        showlegend=True,
        legend=dict(orientation="v", yanchor="top", y=1, xanchor="left", x=1.02)
    )
    
    return fig

def create_cluster_distribution_chart(insights):
    """Create cluster distribution chart"""
    names = [insight['name'] for insight in insights]
    counts = [insight['count'] for insight in insights]
    colors = [insight['color'] for insight in insights]
    
    fig = go.Figure(data=[go.Pie(
        labels=names,
        values=counts,
        marker_colors=colors,
        hole=0.4
    )])
    
    fig.update_layout(
        title="Customer Segment Distribution",
        height=400
    )
    
    return fig

def download_results(df, clusters, insights):
    """Generate downloadable results"""
    df_results = df.copy()
    df_results['cluster'] = clusters
    df_results['cluster_name'] = df_results['cluster'].map({
        insight['cluster_id']: insight['name'] for insight in insights
    })
    
    # Convert to CSV
    csv_buffer = io.StringIO()
    df_results.to_csv(csv_buffer, index=False)
    csv_data = csv_buffer.getvalue()
    
    return csv_data

# Main application
def main():
    # Header
    st.markdown('<div class="main-header">📊 Customer Segmentation Analytics</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Advanced K-Means clustering analysis to identify strategic customer personas and unlock actionable insights for targeted marketing campaigns.</div>', unsafe_allow_html=True)
    
    # Sidebar
    st.sidebar.title("🎛️ Controls")
    
    # Data upload section
    st.sidebar.subheader("📁 Data Upload")
    uploaded_file = st.sidebar.file_uploader(
        "Upload your customer CSV file",
        type=['csv'],
        help="CSV should contain customer records with numeric columns for analysis"
    )
    
    use_sample_data = st.sidebar.button("🎲 Use Sample Data")
    
    # Load data
    if uploaded_file is not None:
        try:
            df = pd.read_csv(uploaded_file)
            st.sidebar.success(f"✅ Loaded {len(df)} records")
        except Exception as e:
            st.sidebar.error(f"❌ Error loading file: {str(e)}")
            return
    elif use_sample_data:
        df = load_sample_data()
        st.sidebar.success(f"✅ Loaded {len(df)} sample records")
    else:
        # Show upload instructions
        st.markdown("""
        <div class="upload-section">
            <h3>🚀 Get Started</h3>
            <p>Upload your customer CSV file or use sample data to begin clustering analysis.</p>
            <p><strong>Expected columns:</strong> customer_id, annual_spending, purchase_frequency, avg_order_value, etc.</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Show sample data format
        st.subheader("📋 Expected CSV Format")
        sample_df = load_sample_data().head()
        st.dataframe(sample_df, use_container_width=True)
        return
    
    # Identify numeric columns
    numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
    
    if len(numeric_columns) < 2:
        st.error("❌ Dataset must contain at least 2 numeric columns for clustering analysis.")
        return
    
    # Clustering parameters
    st.sidebar.subheader("⚙️ Clustering Parameters")
    
    # Find optimal clusters
    normalized_data, scaler = normalize_data(df, numeric_columns)
    optimal_k, cluster_range, silhouette_scores = find_optimal_clusters(normalized_data)
    
    n_clusters = st.sidebar.selectbox(
        "Number of Clusters",
        options=cluster_range,
        index=cluster_range.index(optimal_k) if optimal_k in cluster_range else 0,
        help=f"Optimal: {optimal_k} clusters (highest silhouette score)"
    )
    
    # Visualization parameters
    st.sidebar.subheader("📊 Visualization")
    x_feature = st.sidebar.selectbox("X-axis Feature", numeric_columns, index=0)
    y_feature = st.sidebar.selectbox("Y-axis Feature", numeric_columns, index=1 if len(numeric_columns) > 1 else 0)
    
    # Perform clustering
    clusters, kmeans_model, silhouette_avg = perform_clustering(normalized_data, n_clusters)
    insights = generate_cluster_insights(df, clusters, numeric_columns)
    
    # Main content
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <h3>Silhouette Score</h3>
            <h2>{silhouette_avg:.3f}</h2>
            <p>Clustering Quality</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <h3>Total Customers</h3>
            <h2>{len(df):,}</h2>
            <p>Records Analyzed</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <h3>Active Clusters</h3>
            <h2>{n_clusters}</h2>
            <p>Customer Segments</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Visualization section
    st.subheader("📈 Cluster Visualization")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        scatter_fig = create_scatter_plot(df, clusters, x_feature, y_feature, insights)
        st.plotly_chart(scatter_fig, use_container_width=True)
    
    with col2:
        distribution_fig = create_cluster_distribution_chart(insights)
        st.plotly_chart(distribution_fig, use_container_width=True)
    
    # Cluster insights
    st.subheader("🎯 Customer Personas")
    
    for insight in insights:
        with st.expander(f"{insight['name']} ({insight['count']} customers - {insight['percentage']:.1f}%)", expanded=True):
            col1, col2 = st.columns([1, 2])
            
            with col1:
                st.markdown(f"""
                <div style="background-color: {insight['color']}; color: white; padding: 1rem; border-radius: 10px; text-align: center;">
                    <h3>{insight['count']}</h3>
                    <p>Customers</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                st.write("**Key Characteristics:**")
                for feature, value in insight['characteristics'].items():
                    if isinstance(value, float):
                        st.write(f"• {feature.replace('_', ' ').title()}: {value:,.2f}")
                    else:
                        st.write(f"• {feature.replace('_', ' ').title()}: {value}")
    
    # Optimal clusters analysis
    st.subheader("🔍 Clustering Analysis")
    
    if len(silhouette_scores) > 1:
        silhouette_df = pd.DataFrame({
            'Number of Clusters': cluster_range,
            'Silhouette Score': silhouette_scores
        })
        
        fig = px.line(
            silhouette_df, 
            x='Number of Clusters', 
            y='Silhouette Score',
            title='Silhouette Score by Number of Clusters',
            markers=True
        )
        fig.add_vline(x=optimal_k, line_dash="dash", line_color="red", 
                     annotation_text=f"Optimal: {optimal_k} clusters")
        st.plotly_chart(fig, use_container_width=True)
    
    # Data export
    st.subheader("💾 Export Results")
    
    csv_data = download_results(df, clusters, insights)
    
    st.download_button(
        label="📥 Download Clustered Data (CSV)",
        data=csv_data,
        file_name="customer_clusters.csv",
        mime="text/csv",
        help="Download your data with cluster assignments"
    )
    
    # Raw data view
    with st.expander("📋 View Raw Data with Clusters"):
        df_display = df.copy()
        df_display['cluster'] = clusters
        df_display['cluster_name'] = df_display['cluster'].map({
            insight['cluster_id']: insight['name'] for insight in insights
        })
        st.dataframe(df_display, use_container_width=True)

if __name__ == "__main__":
    main()
