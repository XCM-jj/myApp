/**
 * Created by xuchengcheng on 2016/9/5.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.company-notice', {
          url: '/company-notice',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/company-notice/company-notice.html',
              controller: 'companyNoticetCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('companyNoticetCtrl', [
    '$scope',
    'baseConfig',
    '$state',
    '$ionicHistory',
    'hmsPopup',
    'getApplicationService',
    function ($scope,
              baseConfig,
              $state,
              $ionicHistory,
              hmsPopup,
              getApplicationService) {
      var nowPage = 1;
      $scope.companyNoticeList = [];
      $scope.moreDataCanBeLoaded = false;
      companyNotice();
      function companyNotice() {
        var url = baseConfig.mainImgPath + "news.do?";
        var params = {
          type: "2",
          pageNo: nowPage
        };
        hmsPopup.showLoading("请稍后");
        getApplicationService.getMethod(url, params).success(function (response) {
          if(response.msg == "成功"){
            hmsPopup.hideLoading();
            angular.forEach(response.result, function(data, index, array){
              $scope.companyNoticeList.push(array[index]);
            });
            if(response.result.length > 0){
              $scope.moreDataCanBeLoaded = true;
              if(response.result.length < 9) {
                $scope.moreDataCanBeLoaded = false;
              }
            }else{
              $scope.moreDataCanBeLoaded = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            console.log("login response = " + angular.toJson(response));
          }else{
            hmsPopup.hideLoading();
            $scope.moreDataCanBeLoaded = false;
          }
        }).error(function () {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast('处理请求失败,请确认网络连接是否正常,或者联系管理员!');
        });
      }
      $scope.doRefresh = function(){//下拉刷新
        $scope.companyNoticeList = [];
        nowPage = 1;
        companyNotice();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.moreDataCanBeLoaded = false;
      };
      $scope.loadMore = function() {//上拉加载
        nowPage++;
        companyNotice();
      };

      $scope.goNoticeDetail = function (url) {
        //$state.go('tab.mainImgWebsite',{mainImgUrl:url});

        try{
          //if(device.platform=='Android'){
          //  window.open(url, '_blank', 'location=yes,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
          //}else{
          //  window.open(url, '_blank', 'location=no,toolbar=yes,enableViewportScale=yes,toolbarposition=top,closebuttoncaption=关闭');
          //}
          cordova.ThemeableBrowser.open(url, '_blank', {
            statusbar: {
              color: '#385198'
            },
            toolbar: {
              height: 44,
              color: '#385198'
            },
            backButton: {
              wwwImage: 'build/img/back.png',
              wwwImagePressed: 'build/img/back.png',
              wwwImageDensity: 2,
              align: 'left',
              event: 'backPressed'
            },
            forwardButton: {
              wwwImage: 'build/img/forward.png',
              wwwImagePressed: 'build/img/forward.png',
              wwwImageDensity: 2,
              align: 'left',
              event: 'forwardPressed'
            },
            closeButton: {
              wwwImage: 'build/img/close.png',
              wwwImagePressed: 'build/img/close.png',
              wwwImageDensity: 2,
              align: 'right',
              event: 'closePressed'
            },
            backButtonCanClose: false
          })
        }catch(e){
          window.open(url, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
        }
      };

      $scope.goBack = function () {
        $ionicHistory.goBack();
      }
    }]);
