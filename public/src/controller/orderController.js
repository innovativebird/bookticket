angular.module('TurkishApp')
	.controller('orderController',['$scope','$uibModal', 'orderService' , 'FileUploader' , '$location','$cookies', function ($scope, $uibModal, orderService,  FileUploader, $location,$cookies){
		$scope.message = "Orders";
		$scope.animationsEnabled = true;
		$scope.promotion_image = '';
    $scope.url = $location.host();
    $scope.port = $location.port();
    $scope.base_url = 'http://'+$scope.url+':'+$scope.port+'/images/';
    $scope.uid = $cookies.get('user');
    $scope.type = $cookies.get('type');


		$scope.getOwnerDetail = function (){
			orderService.getAllUser($scope.type, $scope.uid)
	  		.then(function (admins){
	  				$scope.admins = admins.data;
	  		})
	  		.catch(function (err){
	  			if(err.status == 500){
	  				$scope.serverError = true;
	  			}
	  	})
		}

	$scope.searchData = function(start, end) {
		var url = $location.path().split("/");
		var eventId = url[2];
		var startDate = start._d;
		var endDate = end._d;

    var data = {
            'uid' : eventId,
            'type' : 'sAdmin',
						'start_date' : startDate,
						'end_date'	: endDate
    }
		orderService.searchOrders(data)
  		.then(function (result){
				if(result.data.msg == "no order found"){
					$scope.orders = [];
				}else{
  			$scope.orders = result.data;
				}
  		})
  		.catch(function (err){
				$scope.err = err.data.msg;
  			if(err.status == 500){
  				// $scope.serverError = true;
  			}
  	})
	}


	$scope.getOrders = function(){
		var url = $location.path().split("/");
		var eventId = url[2];
    var data = {
            'uid' : eventId,
            'type' : 'sAdmin'
    }
  	orderService.getUserOrders(data)
  		.then(function (result){
				if(result.data.msg == "no order found"){
					$scope.orders = [];
				}else{
  			$scope.orders = result.data;
				}
  		})
  		.catch(function (err){
				$scope.err = err.data.msg;
  			if(err.status == 500){
  				// $scope.serverError = true;
  			}
  	})
	}


    // $scope.updatePromotion = function(promotionId){

    // promotionService.getPromotion(promotionId)
    // .then(function (result){
    //   if(result.data.message == "No data found."){
    //   }else{
    //     console.log(result.data);
    //     $scope.promotions = result.data;
    //   }
    // })
    // .catch(function (err){
    //   if(err.status == 500){
    //     $scope.serverError = true;
    //   }
    // })

    // }

    $scope.verifyOrder = function(orderId, status){
        var id = {'id' : orderId, 'status' : status}
        orderService.verifyOrder(id)
        .then(function (orderResult){
            if(orderResult.data.length == 0){
                $scope.orderResult = true;
            }else{
              $scope.getOrders();
                $scope.orderResult = orderResult.data;
								window.location.reload();
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;
            }
        })
    }


	/*********************************************************************/
	/*               Angular file uploading code                         */
	/*********************************************************************/
    $scope.uploader = new FileUploader({
        url: 'http://'+$scope.url+':'+$scope.port+'/upload/uploads'
    });
    // FILTERS
    $scope.uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 150;
        }
    });
        // CALLBACKS
        $scope.remove_image = function(){
            $scope.image_selected = false;
            $scope.show_choose = true;
            $scope.uploader.clearQueue();
            $scope.image_url = '/images/upload.png';
            jQuery('#file').val('');    //empty the input file value so next time if same file selects then it works
        };

        $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
		//console.info('onWhenAddingFileFailed', item, filter, options);
        };
        $scope.uploader.onAfterAddingFile = function(fileItem) {
		//console.info('onAfterAddingFile', fileItem);
            $scope.show_choose = false;
            if(!fileItem.file.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|mp3|mp4|pdf)$/)){
                alert('Selected file is not a valid image');
                $scope.invalid_image = true;
            }else{
                $scope.invalid_image = false;
            }
        };
        $scope.uploader.onAfterAddingAll = function(addedFileItems) {
		//console.info('onAfterAddingAll', addedFileItems);
        };
        $scope.uploader.onBeforeUploadItem = function(item) {
		//console.info('onBeforeUploadItem', item);
        };
        $scope.uploader.onProgressItem = function(fileItem, progress) {
		//console.info('onProgressItem', fileItem, progress);
        };
        $scope.uploader.onProgressAll = function(progress) {
		//console.info('onProgressAll', progress);
        };
        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
		//console.info('onSuccessItem', fileItem, response, status, headers);
        };
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
		//console.info('onErrorItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
		//console.info('onCancelItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.image_selected = true;
		//console.info('onCompleteItem', fileItem, response, status, headers);
            $scope.image_url = '../uploads/images/'+fileItem.file.name;
            $scope.promotion_image = fileItem.file.name;

        };
        $scope.uploader.onCompleteAll = function() {
            console.info('uploader', $scope.uploader.queue);
        };


    $scope.dates = {
        today: moment.tz('UTC').hour(12).startOf('h'),
        end: moment.tz('UTC').hour(12).startOf('h'), //12:00 UTC, today.
        minDate: moment.tz('UTC').add(-4, 'd').hour(12).startOf('h'), //12:00 UTC, four days ago.
        maxDate: moment.tz('UTC').add(4, 'd').hour(12).startOf('h'), //12:00 UTC, in four days.
    };
      $scope.options = {
        view: 'date',
        format: 'lll',
        maxView: false,
        minView: 'hours',
    };
      $scope.minDate = $scope.dates.minDate;
      $scope.maxDate = $scope.dates.maxDate;
      $scope.formats = [
         "MMMM YYYY",
         "DD MMM YYYY",
         "ddd MMM DD YYYY",
         "D MMM YYYY HH:mm",
         "lll",
         "MM-DD-YYYY hh:mm a",
      ];
      $scope.timezones = [
        ['London, UK', 'Europe/London'],
        ['Hong Kong, China', 'Asia/Hong_Kong'],
        ['Vancouver, Canada', 'America/Vancouver'],
      ];
      $scope.views = ['year', 'month', 'date', 'hours', 'minutes'];
      $scope.callbackState = 'Callback: Not fired';
      $scope.changeDate = function (modelName, newDate) {
        console.log(modelName + ' has had a date change. New value is ' + newDate.format());
        $scope.callbackState = 'Callback: Fired';
      }
      $scope.changeMinMax = function (modelName, newValue) {
        //minDate or maxDate updated. Generate events to update relevant pickers
        var values = {
          minDate: false,
          maxDate: false,
        }
        if (modelName === 'dates.minDate') {
          values.minDate = newValue;
          $scope.$broadcast('pickerUpdate', ['pickerMinDate', 'pickerMinDateDiv', 'pickerMaxSelector'], values);
          values.maxDate = $scope.dates.maxDate;
        } else if (modelName === 'dates.maxDate') {
          values.maxDate = newValue;
          $scope.$broadcast('pickerUpdate', ['pickerMaxDate', 'pickerMaxDateDiv', 'pickerMinSelector'], values);
          values.minDate = $scope.dates.minDate;
        }
        //For either min/max update, update the pickers which use both.
        $scope.$broadcast('pickerUpdate', ['pickerBothDates', 'pickerBothDatesDiv'], values);
      }
      $scope.changeData = function (type) {
        var values = {},
            pickersToUpdate = ['pickerMinDate', 'pickerMaxDate', 'pickerBothDates', 'pickerMinDateDiv', 'pickerMaxDateDiv', 'pickerBothDatesDiv', 'pickerRange'];
        switch (type) {
          case 'view':
            values.view = $scope.options.view;
            break;
          case 'minView':
            values.minView = $scope.options.minView;
            break;
          case 'maxView':
            values.maxView = $scope.options.maxView;
            break;
          case 'format':
            values.format = $scope.options.format;
            break;
        }
        if (values) {
          $scope.$broadcast('pickerUpdate', pickersToUpdate, values);
        }
      }
	}])
