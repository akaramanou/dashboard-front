class SearchService {
  constructor(ApiService) {
    'ngInject';
    this._ApiService = ApiService;
  }

  search(query) {
    return this._ApiService.get('/search', { params: { q: query } }).then((response) => {
      return response.data;
    });
  }
}

module.exports = SearchService;
