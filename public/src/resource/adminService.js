angular.module('TurkishApp')
	.service('adminService',['$http','$location',function ($http,$location){
		var URL = 'http://' + $location.host() + ":" + $location.port() + '/owner';
		var req = {};
		this.login = function (data){
			req = {
				'method' : 'POST',
				'url' : URL + '/login',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}
		this.update = function (data){
			data = {'admin' : data};
			console.log(data);
			req = {
				'method' : 'POST',
				'url' : URL + '/update',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}
	}])