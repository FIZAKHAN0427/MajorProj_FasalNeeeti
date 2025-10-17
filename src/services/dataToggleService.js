class DataToggleService {
  constructor() {
    this.useRealData = localStorage.getItem('useRealData') === 'true';
  }

  toggleDataSource() {
    this.useRealData = !this.useRealData;
    localStorage.setItem('useRealData', this.useRealData.toString());
    window.location.reload(); // Refresh to apply changes
  }

  isUsingRealData() {
    return this.useRealData;
  }

  async getDataSource(mockData, realDataFetcher) {
    if (this.useRealData) {
      try {
        const realData = await realDataFetcher();
        return realData.success ? realData.data : mockData;
      } catch (error) {
        console.warn('Real data failed, using mock:', error);
        return mockData;
      }
    }
    return mockData;
  }
}

export default new DataToggleService();