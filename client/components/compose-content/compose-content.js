'use strict';
const config = require('./config.json');

/**
 * IndexController
 */
class ComposeContentController {
  constructor($scope, $element, AuthService, TweetService, Notifications) {
    'ngInject';
    this._element = $element[0];
    this._$element = $element;
    this.TweetService = TweetService;
    this.Notifications = Notifications;

    this.tweetForm = {
      content: null,
      image: null,
      hasImage: false
    };

    this.currentUser = AuthService.getUser();

    this.onElementClickBind = this.onElementClick.bind(this);
    this.onElementKeydownBind = this.onElementKeydown.bind(this);
    this.onContentClickBind = this.onContentClick.bind(this);
    this.onToolbarClickBind = this.onToolbarClick.bind(this);
    this.onDocumentClickBind = this.onDocumentClick.bind(this);
  }

  $onInit() {
    let $contentInput = this._$element.find(config.selectors.CONTENT_INPUT);
    let $contentToolbar = this._$element.find(config.selectors.CONTENT_TOOLBAR);

    this._$element.on('click', this.onElementClickBind);
    this._$element.on('keydown', this.onElementKeydownBind);
    $contentInput.on('click', this.onContentClickBind)
    $contentToolbar.on('click', this.onToolbarClickBind);

    this.initializeReplyContent();
    this.initializeInfographics();
  }

  $onDestroy() {
    let $contentInput = this._$element
      .find(config.selectors.CONTENT_INPUT)
    let $contentToolbar = this._$element.find(config.selectors.CONTENT_TOOLBAR);

    this._$element.off('click', this.onElementClickBind);
    this._$element.off('keydown', this.onElementKeydownBind);
    $contentInput.off('click', this.onContentClickBind)
    $contentToolbar.off('click', this.onToolbarClickBind);
  }

  initializeReplyContent() {
    if (this.replyTo) {
      let mentions = [`@${this.replyTo.user.screen_name}`];

      if (this.replyTo.entities && this.replyTo.entities.user_mentions) {
        angular.forEach(this.replyTo.entities.user_mentions, function (userMention) {
          let username = `@${userMention.screen_name}`;
          if (mentions.indexOf(username) < 0) {
            mentions.push(username);
          }
        });
      }

      this.tweetForm.content = mentions.join(' ') + '&nbsp;';
    }
  }

  initializeInfographics() {
    if (!this.infographics) return false;

    this.tweetForm.infographicId = this.infographics.id;
    // this.tweetForm.image = this.infographics.url;
    this.tweetForm.hasImage = true;
  }

  onElementClick(e) {
    if (this._$element.hasClass(config.cssClasses.IS_FOCUSED)) {
      e.stopPropagation();
    }
  }

  onElementKeydown(e) {
    if (e.keyCode === 27 && this._$element.hasClass(config.cssClasses.IS_FOCUSED)) {
      e.stopPropagation();
    }
  }

  onContentClick(e) {
    e.stopPropagation();
    this._$element.addClass(config.cssClasses.IS_FOCUSED);

    setTimeout(() => {
      document.addEventListener('click', this.onDocumentClickBind);
    });
  }

  onToolbarClick(e) {
    e.stopPropagation();
  }

  onDocumentClick(e) {
    this._$element.removeClass(config.cssClasses.IS_FOCUSED);
    if (this.tweetForm.content) {
      this._$element.addClass(config.cssClasses.IS_DIRTY);
    } else {
      this._$element.removeClass(config.cssClasses.IS_DIRTY);
    }
    document.removeEventListener('click', this.onDocumentClickBind);
  }

  selectImage($file) {
    if ($file) {
      this.tweetForm.image = $file;
      this.tweetForm.hasImage = true;
    }
  }

  removeImage() {
    this.tweetForm.image = null;
    this.tweetForm.hasImage = false;

    if (this.infographics) {
      this.infographics = null;
    }
  }

  submitContent($event) {
    if ($event) {
      $event.preventDefault();
    }

    let tweetData = {
      text: this.tweetForm.content
    };

    if (this.replyTo) {
      tweetData.replyStatusId = this.replyTo.id;
    }

    if (this.tweetForm.image) {
      tweetData.file = this.tweetForm.image; 
    }

    if (this.tweetForm.infographicId) {
      tweetData.infographicId = this.tweetForm.infographicId;
      tweetData.file = undefined;
    }

    this._$element.addClass(config.cssClasses.IS_POSTING);
    this.TweetService.create(tweetData).then((createdTweet) => {
      this.Notifications.success('Tweet successfully posted');

      this.tweetForm.content = null;

      if (!this.tweetForm.infographicId) {
        this.tweetForm.image = null;
        this.tweetForm.hasImage = false;
      }
      
      this._$element.removeClass(config.cssClasses.IS_FOCUSED);
      this._$element.removeClass(config.cssClasses.IS_DIRTY);
      this._$element.removeClass(config.cssClasses.IS_POSTING);

      this.onCreate({ $createdTweet: createdTweet });
    }).catch(() => {
      this.Notifications.error('Tweet post failed');
      this._$element.removeClass(config.cssClasses.IS_POSTING);
    });
  }

};


module.exports = {
  templateUrl: 'views/compose-content/compose-content.html',
  controller: ComposeContentController,
  bindings: {
    replyTo: '=',
    infographics: '=',
    onCreate: '&'
  }
};
