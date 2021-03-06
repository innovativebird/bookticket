angular.module('TurkishApp')
	.service('orderService',['$http','$location',function ($http,$location){

		var URL = "http://" + $location.host() + ':' + $location.port() + "/ticket";
		var req = {};
		this.getAllPromotions = function(){
			req = {
				'method' : 'GET',
				'url' : URL+"/allPromotions",
			}
			return $http(req);
		}

		this.getAllUser = function(type, uid){
			req = {
				'method' : 'GET',
				'url' : URL+"?type="+type+'&uid='+uid,
			}
			return $http(req);
		}

		this.getUserOrders = function(data){
			req = {
				method : "POST",
				url : URL + '/getUserOrders',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		}

		this.searchOrders = function(data){
			req = {
				method : "POST",
				url : URL + '/searchOrders',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		}


		this.verifyOrder = function(data){
			req = {
				method : "POST",
				url : URL + '/verifyOrder',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		}

	}])
