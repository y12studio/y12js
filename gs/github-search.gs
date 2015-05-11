function searchGithub(){
  var array = [];
  var url = 'https://api.github.com/search/repositories?q=bitcoin+stars%3A%3E100&sort=updated&order=desc&per_page=100';
  var json = UrlFetchApp.fetch(url).getContentText();
  var data = JSON.parse(json);
  Logger.log(data['total_count']);
  Logger.log(data['items'].length);
  array.push(['name','star','url','open issue','language','description']);
  for (i=0; i<data['items'].length;i++) {
    var x = data['items'][i];
    array.push([x['full_name'],x['stargazers_count'],x['html_url'],x['open_issues'],x['language'],x['description']]);
  }
  // Logger.log(array);
  return array;
}
