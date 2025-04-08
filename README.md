# 🎬 Netflix/Streaming Trends Analyzer

## 📌 Project Overview  
The **Netflix/Streaming Trends Analyzer** is an interactive data visualization project designed to explore how audience interest in Netflix content evolves over time. Using Netflix’s publicly available catalog metadata, IMDb ratings from the OMDb API, and search interest data from Google Trends (via PyTrends), we will create a dashboard that visualizes the relationship between viewer behavior, content quality, and trending genres.

The project is part of the **Data Visualization Track** and focuses on user-driven storytelling through dynamic visuals and filtering.

---

## 📊 Technologies & Tools  
- **Python**: For data extraction, processing, and backend logic  
- **Dash (Plotly)**: For building interactive data visualizations  
- **PostgreSQL**: To store cleaned and merged data  
- **PyTrends**: For retrieving Google search trends on Netflix content  
- **OMDb API**: To fetch IMDb ratings and additional metadata  
- **JavaScript and HTML**: For database interaction and visual display  

---

## 📁 Dataset Sources  
- **[Netflix Titles Dataset – Kaggle](https://www.kaggle.com/datasets/shivamb/netflix-shows)**  
- **[OMDb API](https://www.omdbapi.com/)** – For IMDb ratings and reviews  
- **[Google Trends – via PyTrends API](https://github.com/GeneralMills/pytrends)**  

---

## 📦 Project Features

### 🔄 ETL Pipeline
We’ll build a custom ETL pipeline to:
1. **Extract** Netflix show data, OMDb rating info, and search interest via PyTrends  
2. **Transform** the datasets (clean, normalize, and join by title/date)  
3. **Load** the unified data into a PostgreSQL database  

### 📈 Dashboard Interactions
- **Search by show title or genre**
- Visualize:
  - Popularity trends (Google search interest over time)
  - IMDb ratings pulled live from OMDb
  - Seasonal or genre-based interest patterns

### 📊 Visual Views
Our dashboard will include **at least three visual components**:
1. **Line Graph** – Viewer interest over time  
2. **Bar Chart** – IMDb ratings by genre or year  
3. **Scatter Plot** – Comparison of popularity vs. ratings  

---

## 🧠 Key Questions  
- What shows or genres are trending over time?  
- Do critically acclaimed shows consistently align with public interest?  
- Which months or seasons see spikes in genre-based viewership?  
- What are the long-term popularity arcs of Netflix Originals?

---

## 🤝 Ethical Considerations  
We are committed to using publicly available and ethically sourced data. Google Trends data may not fully represent all demographics and regions, and OMDb ratings reflect user-submitted scores that may carry inherent biases. We will clearly note any limitations and avoid presenting visualizations as predictive or absolute. Our focus is on storytelling and exploration, not making deterministic judgments.

---

## 📚 References  
- [Netflix Titles Dataset – Kaggle](https://www.kaggle.com/datasets/shivamb/netflix-shows)  
- [OMDb API](https://www.omdbapi.com/) – For retrieving IMDb ratings and movie metadata  
- [PyTrends GitHub](https://github.com/GeneralMills/pytrends) – Unofficial Google Trends API for Python  
- [Dash by Plotly](https://dash.plotly.com/) – Python framework for building analytical web applications  

> Code and content sourced externally will be credited appropriately in comments and documentation.


