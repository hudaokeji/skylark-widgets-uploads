/**
 * skylark-widgets-uploads - The skylark file upload  widget library
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-uploads/
 * @license MIT
 */
!function(e,i){var t=i.define,s=i.require,n="function"==typeof t&&t.amd,a=!n&&"undefined"!=typeof exports;if(!n&&!t){var l={};t=i.define=function(e,i,t){"function"==typeof t?(l[e]={factory:t,deps:i.map(function(i){return function(e,i){if("."!==e[0])return e;var t=i.split("/"),s=e.split("/");t.pop();for(var n=0;n<s.length;n++)"."!=s[n]&&(".."==s[n]?t.pop():t.push(s[n]));return t.join("/")}(i,e)}),resolved:!1,exports:null},s(e)):l[e]={factory:null,resolved:!0,exports:t}},s=i.require=function(e){if(!l.hasOwnProperty(e))throw new Error("Module "+e+" has not been defined");var t=l[e];if(!t.resolved){var n=[];t.deps.forEach(function(e){n.push(s(e))}),t.exports=t.factory.apply(i,n)||null,t.resolved=!0}return t.exports}}if(!t)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(e,i){e("skylark-widgets-uploads/uploads",["skylark-langx/skylark"],function(e){return e.attach("widgets.updates",{})}),e("skylark-widgets-uploads/MultiUploader",["skylark-langx/skylark","skylark-langx/langx","skylark-domx-query","skylark-net-http/Upload","skylark-widgets-base/Widget","./uploads"],function(e,i,t,s,n,a){var l=n.inherit({klassName:"Uploader",pluginName:"lark.multiuploader",options:{uploadUrl:"/upload",params:{formParamName:"file"},maxConnections:3,allowedExtensions:[],sizeLimit:0,minSizeLimit:0,autoUpload:!1,selectors:{fileList:".file-list",fileItem:".file-item",nodata:".file-list .no-data",picker:".file-picker",dropzone:".file-dropzone",pastezone:".file-pastezone",startUploads:".start-uploads",cancelUploads:".cancel-uploads"},template:'<div class="lark-multiuploader">    <h3 class="popover-title">Upload files</h3>    <div class="popover-content container-fluid" class="file-list file-dropzone file-pastezone">        <div class="no-data"><em>Add files.</em></div>    </div>    <footer>        <button class="btn btn-warning pull-right btn-sm" id="cancel-uploads-button"><i class="icon-cancel"></i>Cancel uploads</button>        <span class="btn btn-success fileinput-button btn-sm" id="fileinput-button">            <i class="icon-plus"></i>            <span>Add files...</span>            <input id="fileupload" type="file" name="files[]" multiple="multiple">        </span>        <button class="btn btn-primary btn-sm" id="start-uploads-button"><i class="icon-start"></i>Start uploads</button>    </footer></div>',dataType:"json",fileItem:{selectors:{name:".name",size:".size",cancel:".cancel",clear:".clear",progress:".progress",message:".message"},template:'<div class="file-item row">   <div class="col-md-6"><span class="name"></span></div>   <div class="col-md-3">    <span class="size"></span>    <div class="progress hidden">        <div class="progress-label"></div>        <div class="bar"></div>    </div>    <span class="message hidden"></span>   </div>   <div class="col-md-3">    <button class="btn btn-warning btn-xs cancel"><i class="icon-remove"></i>Cancel</button>    <button class="btn btn-xs clear hidden">Clear</button>   </div></div>'}},state:{},_init:function(){this._initEventHandler(),this._initFileHandlers(),this._initUpoadHandler(),this._updateFileList()},_initFileHandlers:function(){var e=this,i=this.options.selectors,t=i.dropzone,s=i.pastezone,n=i.picker;t&&this._velm.$(t).dropzone({dropped:function(i){e._addFiles(i)}}),s&&this._velm.$(s).pastezone({pasted:function(i){e._addFiles(i)}}),n&&this._velm.$(n).picker({multiple:!0,picked:function(i){e._addFiles(i)}})},_initUpoadHandler:function(){var e=this;this._handler=new s({url:this.options.uploadUrl,maxConnections:this.options.maxConnections,onProgress:function(i,t,s,n){e._onProgress(i,t,s,n)},onComplete:function(i,t,s){e._onComplete(i,t,s)},onCancel:function(i,t){e._onCancel(i,t)},onFailure:function(i,t,s){e._onFailure(i,t,s)}})},_initEventHandler:function(){var e=this,i=this.options.selectors,s=this.options.fileItem.selectors;this._listElement;this._velm.$(i.fileList).on("click",s.cancel,function(s){var n=t(this).closest(i.fileItem),a=n.data("fileId");e._handler.cancel(a),n.remove(),e._updateFileList()}),this._velm.$(i.fileList).on("click",s.clear,function(s){var n=t(this).closest(i.fileItem);n.data("fileId");n.remove(),e._updateFileList()}),this._velm.$(i.cancelUploads).click(function(){var s=e._velm.$(i.fileList).find(i.fileItem);s.forEach(function(i){var s=t(i),n=s.data("fileId");e._handler.cancel(n),s.remove()}),e._updateFileList()}),this._velm.$(i.startUploads).click(function(){var s=e._velm.$(i.fileList).find(i.fileItem);s.forEach(function(i){var s=t(i),n=s.data("fileId");s.data("status")||e._handler.send(n,e.options.params)})})},_onProgress:function(e,i,t,s){var n=this._getItemByFileId(e),a=parseInt(t/s*100,10),l=this._formatSize(t)+" of "+this._formatSize(s);n.data("status","running"),n.find(".progress").find(".bar").css("width",a+"%").parent().find(".progress-label").html(l),this._updateFile(n)},_onComplete:function(e,i,t){this._filesInProgress--;var s=this._getItemByFileId(e);s.data("status","done"),s.find(".message").html('<i class="icon-success"></i> '+(this.doneMsg||"Uploaded")),this._updateFile(s)},_onFailure:function(e,i,t){this._filesInProgress--;var s=this._getItemByFileId(e);s.data("status","error"),s.find(".message").html('<i class="icon-error"></i> '),this._updateFile(s)},_onCancel:function(e,i){this._filesInProgress--;var t=this._getItemByFileId(e);t.data("status","cancel"),this._updateFile(t)},_addToList:function(e,i){var i=this._handler.getName(e),s=this._handler.getSize(e),n=t(this.options.fileItem.template);n.data("fileId",e),n.find(this.options.fileItem.selectors.name).html(this._formatFileName(i)),n.find(this.options.fileItem.selectors.size).html(this._formatSize(s)),this._velm.$(this.options.selectors.fileList).append(n),this._updateFileList()},_updateFileList:function(){var e=this.options.selectors,i=(this.options.fileItem.selectors,this._velm.$(e.fileList).find(e.fileItem)),t=this._velm.$(e.cancelUploads+","+e.startUploads),s=this._velm.$(e.nodata);i.length>0?(t.removeClass("hidden"),s.addClass("hidden")):(t.addClass("hidden"),s.removeClass("hidden"))},_updateFile:function(e){var i=this.options.fileItem.selectors,t=e.find(i.size+","+i.cancel),s=e.find(i.progress+","+i.cancel),n=e.find(i.message+","+i.clear),a=e.data("status");"pending"==a?(s.add(n).addClass("hidden"),t.removeClass("hidden")):"running"==a?(t.add(n).addClass("hidden"),s.removeClass("hidden")):"done"!=a&&"error"!=a||(t.add(s).addClass("hidden"),n.removeClass("hidden"))},_getItemByFileId:function(e){for(var i,s=this.options.selectors,n=this._velm.$(s.fileList).find(s.fileItem),a=0;a<n.length;a++){var l=n[a];if(t(l).data("fileId")==e){i=l;break}}if(i)return t(i)},_addFiles:function(e){for(var i=0;i<e.length;i++)if(!this._validateFile(e[i]))return;for(var i=0;i<e.length;i++)this._addFile(e[i])},_addFile:function(e){var i=this._handler.add(e);this._filesInProgress++,this._addToList(i)},_validateFile:function(e){var i,t;return e.value?i=e.value.replace(/.*(\/|\\)/,""):(i=null!=e.fileName?e.fileName:e.name,t=null!=e.fileSize?e.fileSize:e.size),this._isAllowedExtension(i)?0===t?(this._error("emptyError",i),!1):t&&this.options.sizeLimit&&t>this.options.sizeLimit?(this._error("sizeError",i),!1):!(t&&t<this.options.minSizeLimit)||(this._error("minSizeError",i),!1):(this._error("typeError",i),!1)},_error:function(e,i){var t=this.options.messages[e];function s(e,i){t=t.replace(e,i)}s("{file}",this._formatFileName(i)),s("{extensions}",this.options.allowedExtensions.join(", ")),s("{sizeLimit}",this._formatSize(this.options.sizeLimit)),s("{minSizeLimit}",this._formatSize(this.options.minSizeLimit)),this.options.showMessage(t)},_formatFileName:function(e){return e.length>33&&(e=e.slice(0,19)+"..."+e.slice(-13)),e},_isAllowedExtension:function(e){var i=-1!==e.indexOf(".")?e.replace(/.*[.]/,"").toLowerCase():"",t=this.options.allowedExtensions;if(!t.length)return!0;for(var s=0;s<t.length;s++)if(t[s].toLowerCase()==i)return!0;return!1},_formatSize:function(e){var i=-1;do{e/=1024,i++}while(e>99);return Math.max(e,.1).toFixed(1)+["KB","MB","GB","TB","PB","EB"][i]}});return a.MultiUploader=l}),e("skylark-widgets-uploads/main",["./uploads","./MultiUploader"],function(e){return e}),e("skylark-widgets-uploads",["skylark-widgets-uploads/main"],function(e){return e})}(t),!n){var o=s("skylark-langx/skylark");a?module.exports=o:i.skylarkjs=o}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-widgets-uploads.js.map