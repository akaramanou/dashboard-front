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
    template: '<handles-component handles="$resolve.handles" topics="$resolve.topics"></handles-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    resolve: {
      handles: function (HandleService) {
        'ngInject'
        return HandleService.list({ sort: 'created_at', sortOrder: 'desc', related: '["topics"]' });
      },
      topics: function (TopicService) {
        'ngInject';
        return TopicService.list();
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
        if (topic) {
          return $state.go('topic', { id: topic.id });
        } else {
          return $state.go('manage_topics');
        }
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

  $stateProvider.state('manage_topics.topic', {
    url: '/:id',
    template: '<manage-topic-component topic="$resolve.topicModel"></manage-topic-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    resolve: {
      topicModel: function ($stateParams, TopicService) {
        'ngInject';
        return TopicService.find($stateParams.id);
      }
    },
    onEnter: function (PageService, topicModel) {
      'ngInject';
      PageService.setTitle('Manage "' + topicModel.name + '" topic');
    }
  })

  $stateProvider.state('topic', {
    url: '/topic/:id',
    template: '<topic-component topics="$resolve.topics" topic-cursors="$resolve.topicCursors"></topic-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    resolve: {
      topics: function (TopicService) {
        'ngInject';
        return TopicService.list();
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
      PageService.setTitle(topicCursors.currentTopic.name);
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
    url: '/infographics/:start_date/:end_date',
    // params: { start_date: null, end_date: null },
    template: '<infographics-component></infographics-component>',
    data: { permissions: { only: ['user'], redirectTo: 'login' } },
    onEnter: function ($state, $stateParams, $filter, PageService) {
      'ngInject';

      if (!$stateParams.start_date && !$stateParams.end_date) {
        $state.go('infographics', {
          start_date: '2016-10-01',
          end_date: '2016-10-31'
        }, { reload: true, location: true });
      } else {
        PageService.setTitle($filter('dateFilter')($stateParams.start_date, 'MMMM') + ' infographics');
      }
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
