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
      // Extract the information from the Widget Script
      this.engineUrl = widgetScript.getAttribute('data-url');
      this.engineCompany = widgetScript.getAttribute('data-company');
      this.enginePromotionCode = widgetScript.getAttribute('data-promotion-code');
      this.engineAgentId = widgetScript.getAttribute('data-agent-id');
      if (widgetScript.getAttribute('data-load-jquery') === 'false') {
        this.engineLoadJQuery = false;
        this.totalScripts = this.totalScripts - 1;
      }

      // Extract the information from the URL
      var urlVars = this.getUrlVars();
      if (urlVars['promotionCode']) {
        this.enginePromotionCode = urlVars['promotionCode'];
      }
      if (urlVars['agentId']) {
        this.engineAgentId = urlVars['agentId'];
      }

    }

    // Load the scripts
    if (widgetScript && 
       ((this.engineUrl && this.engineUrl != '') || (this.engineCompany && this.engineCompany != ''))) {
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
   * 
   * @returns Get the URL parameters
   */
  this.getUrlVars = function() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
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
    if (this.engineUrl && this.engineUrl != '') {
      var url = `${this.engineUrl}/?promotionCode=${this.enginePromotionCode}&agentId=${this.engineAgentId}`;
    }
    else if (this.engineCompany && this.engineCompany != '') {
      var prefix = atob('aHR0cHM6Ly93aWRnZXQubXlib29raW5nLmRldg==');
      var urlParams = [];
      if (typeof this.enginePromotionCode !== 'undefined' && 
          this.enginePromotionCode !== null && this.enginePromotionCode !== '') {
        urlParams.push(`promotionCode=${this.enginePromotionCode}`);
      }
      if (typeof this.engineAgentId !== 'undefined' && 
          this.engineAgentId !== null && this.engineAgentId != '') {
        urlParams.push(`agentId=${this.engineAgentId}`);
      }
      var params = '';
      if (urlParams.length > 0) { 
        params = '&'+urlParams.join('&');
      }
      var url = `${prefix}/?widget=true&company=${this.engineCompany}${params}`;
    }
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
