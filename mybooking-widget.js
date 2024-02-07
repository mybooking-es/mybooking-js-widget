function MybookingWidget() {

  this.scriptId = "mybooking_script_widget";
  this.engineUrl = null;
  this.enginePromotionCode = null;
  this.engineAgentId = null;
  this.engineLoadJQuery = true;
  this.dataContainer = "mybooking_widget_container";
  this.jQuery = "https://code.jquery.com/jquery-3.7.1.min.js";
  this.iframeResizer = "https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js";
  this.scriptJQuery = null;
  this.scriptResizer = null;
  this.loadedScripts = 0;
  this.totalScripts = 2;

  /**
   * Initialize
   */
  this.init = function() {
    // Get the iframe information
    var widgetScript = document.getElementById('js-mybooking');

    // Extract the information from the script
    if (widgetScript) {
      this.engineUrl = widgetScript.getAttribute('data-url');
      this.enginePromotionCode = widgetScript.getAttribute('data-promotion-code');
      this.engineAgentId = widgetScript.getAttribute('data-agent-id');
      if (widgetScript.getAttribute('data-load-jquery') === 'false') {
        this.engineLoadJQuery = false;
        this.totalScripts = this.totalScripts - 1;
      }
    }

    // Load the scripts
    if (widgetScript && this.engineUrl && this.engineUrl != '') {
      // Load jQuery
      if (this.engineLoadJQuery) {
        this.scriptJQuery = document.createElement("script");
        this.scriptJQuery.src = this.jQuery;    
      } 
      // Load iFrameResizer
      var self = this;
      this.scriptResizer = document.createElement("script");
      this.scriptResizer.src = this.iframeResizer;
      // Scripts loaded
      if (this.engineLoadJQuery) {
        this.scriptJQuery.addEventListener('load', function(){
          self.scriptsLoaded();
        }); 
        document.body.appendChild(this.scriptJQuery);
      }
      this.scriptResizer.addEventListener('load', function(){
        self.scriptsLoaded();
      });
      document.body.appendChild(this.scriptResizer);
    }

  }

  /**
   * Scripts loaded
   */
  this.scriptsLoaded = function() {
      
    this.loadedScripts++;
    if (this.loadedScripts == this.totalScripts) {
      this.createIframe();
    }
  }

  /**
   * Create the iframe
   */
  this.createIframe = function() {
    var url = `${this.engineUrl}/?promotionCode=${this.enginePromotionCode}&agentId=${this.engineAgentId}`;
    // Create the iframe
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.border = "1px solid #eeeeee";
    iframe.style.width = "100%";
    iframe.style.overflow = "overflow";
    iframe.style.height = "600px";
    iframe.onload = function() {
      iFrameResize(iframe);
    }
    var widgetContainer = document.getElementById(this.dataContainer);
    if (widgetContainer) {
      widgetContainer.appendChild(iframe);
    }
  }
}
document.addEventListener("DOMContentLoaded", function() {
  var mybookingWidget = new MybookingWidget();
  mybookingWidget.init();
});
