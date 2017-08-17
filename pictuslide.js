var H5P = H5P || {};

H5P.PictuSlide = (function ($) {
  /**
   * Constructor function.
   */
  function C(options, contentId, extras) {
    var self = this;
    this.$ = $(this);
    this.aspectRatio = this.originalAspectRatio = extras.aspectRatio;
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      picture: null,
    }, options);
    // Keep provided id.
    this.contentId = contentId;
    
    this.image = H5P.newRunnable(this.options.picture, this.contentId);
    this.image.on('loaded', function() {
      self.trigger('loaded');
      self.trigger('resize');
    });
  };

  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  C.prototype.attach = function ($container) {
    this.$container = $container;
    
    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-pictuslide");
    
    this.$imageHolder = $('<div>', {
      class: 'h5p-pictuslide-image-holder',
    });
    
    $container.append(this.$imageHolder);
    
    // Add picture
    this.image.attach(this.$imageHolder);
    
    this.adjustSize();
  };
  
  C.prototype.setAspectRatio = function(newAspectRatio) {
    this.aspectRatio = newAspectRatio;
    // Adjust size if image has been attached
    if (this.$imageHolder) {
      this.adjustSize();
    }
  };
  
  C.prototype.resetAspectRatio = function() {
    this.aspectRatio = this.originalAspectRatio;
    // Adjust size if image has been attached
    if (this.$imageHolder) {
      this.adjustSize();
    }
  };
  
  C.prototype.adjustSize = function() {
    var imageHeight = this.options.picture.params.file.height;
    var imageWidth = this.options.picture.params.file.width;

    var imageAspectRatio = imageWidth / imageHeight;
    if (this.aspectRatio >= imageAspectRatio) {
      // image too tall - Make it smaller and center it
      var widthInPercent = imageAspectRatio / this.aspectRatio * 100;
      var borderSize = (100 - widthInPercent) / 2 + '%';
      this.$imageHolder.css({
        height: '100%',
        width: imageAspectRatio / this.aspectRatio * 100 + '%',
        paddingLeft: borderSize,
        paddingRight: borderSize,
        paddingTop: 0,
        paddingBottom: 0
      });
    }
    else if (this.aspectRatio < imageAspectRatio) {
      // image too wide
      var heightInPercent = this.aspectRatio / imageAspectRatio * 100;
      
      // Note: divide by aspect ratio since padding top/bottom is relative to width
      var borderSize = (100 - heightInPercent) / 2 / this.aspectRatio + '%';
    
      this.$imageHolder.css({
        width: '100%',
        height: heightInPercent + '%',
        paddingTop: borderSize,
        paddingBottom: borderSize,
        paddingLeft: 0,
        paddingRight: 0
      });
    }
    else if (this.aspectRatio === undefined) {
      this.$imageHolder.css({
        width: '100%',
        height: '',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
      });
    }
    
  }

  return C;
})(H5P.jQuery);