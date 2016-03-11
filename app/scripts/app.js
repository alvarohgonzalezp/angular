(function(){
  'use strict';
  //Aqui ira la funcionalidad
  //angular.module('blog', ['ngRoute']);
  angular.module('blog', ['blog.controllers']);

function config($locationProvider, $routeProvider){
  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', {
    templateUrl: 'views/post-list.tpl.html',
    controller: 'PostListController',
    controllerAs: 'postlist'
  })
  .when('/post/:postId', {
    templateUrl: 'views/post-detail.tpl.html',
    controller: 'postDetailController',
    controllerAs: 'postdetail'
  })
  .when('/new', {
    templateUrl: 'views/post-create.tpl.html',
    controller: 'PostCreateController',
    controllerAs: 'postcreate'
  });
}
angular
  .module('blog')
  .config(config);
})();
