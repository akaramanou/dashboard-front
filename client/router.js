module.exports = function ($stateProvider) {
  'ngInject';

  /**
   * Component routes
   */

  $stateProvider.state('index', {
    url: '/',
    template: '<index-component></index-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    onEnter: function (PageService) {
      'ngInject';
      PageService.setTitle('Home');
    }
  })

  $stateProvider.state('handles', {
    url: '/handles',
    template: '<handles-component topics="$resolve.topics"></handles-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    resolve: {
      topics: function (TopicService) {
        'ngInject';
        return TopicService.list(true);
      }
    },
    onEnter: function (PageService) {
      'ngInject';
      PageService.setTitle('Handles');
    }
  })

  $stateProvider.state('handle', {
    url: '/handle/:id',
    template: '<handle-component></handle-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    resolve: {
      handleModel: function ($stateParams) {
        'ngInject';
        return {
          id: $stateParams.id
        };
      }
    },
    onEnter: function (PageService, handleModel) {
      'ngInject';
      PageService.setTitle(handleModel.id);
    }
  })

  $stateProvider.state('topics', {
    url: '/topics',
    template: '<div></div>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    onEnter: function ($state, TopicService) {
      'ngInject';
      TopicService.findFirst().then(function (topic) {
        return $state.go('topic', { id: topic.id });
      });
    }
  })

  $stateProvider.state('manage_topics', {
    url: '/topics/manage',
    template: '<manage-topics-component topics="$resolve.topics"></manage-topics-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    resolve: {
      topics: function (TopicService) {
        'ngInject';
        return TopicService.list(true);
      }
    },
    onEnter: function (PageService) {
      'ngInject';
      PageService.setTitle('Manage topics');
    }
  })

  $stateProvider.state('topic', {
    url: '/topic/:id',
    template: '<topic-component topics="$resolve.topics" topic-cursors="$resolve.topicCursors"></topic-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    resolve: {
      topics: function (TopicService) {
        'ngInject';
        return TopicService.list(true);
      },
      topicCursors: function ($stateParams, TopicService) {
        'ngInject';
        return TopicService.find($stateParams.id).then(function (topicModel) {
          return TopicService.getCursors(topicModel);
        });
      }
    },
    onEnter: function (PageService, topicCursors) {
      'ngInject';
      PageService.setTitle(topicCursors.currentTopic.title);
    }
  })

  $stateProvider.state('conversations', {
    url: '/conversations',
    template: '<conversations-component></conversations-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    onEnter: function (PageService) {
      'ngInject';
      PageService.setTitle('Conversations');
    }
  })

  $stateProvider.state('infographics', {
    url: '/infographics',
    template: '<infographics-component></infographics-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    onEnter: function (PageService) {
      'ngInject';
      PageService.setTitle('Infographics');
    }
  })

  /**
   * Auth routes
   */

   $stateProvider.state('profile', {
     url: '/profile',
     template: '<profile-component></profile-component>',
     data: { permissions: { only: ['user'] } },
     onEnter: function (PageService) {
       'ngInject';
       PageService.setTitle('Profile');
     }
   })

   $stateProvider.state('login', {
     url: '/login',
     template: '<login-component></login-component>',
     data: { permissions: { only: ['guest'], redirectTo: 'index' } },
     onEnter: function (PageService) {
       'ngInject';
       PageService.setTitle('Login');
     }
   })

   $stateProvider.state('logout', {
     url: '/logout',
     template: '<div></div>',
     controller: function ($state) {
       'ngInject';
       $state.go('login');
     },
     data: { permissions: { only: ['user'], redirectTo: 'login' } }
   })
};
