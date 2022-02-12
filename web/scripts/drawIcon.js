// drawIcon
//
// http://code.google.com/p/svgweb/wiki/ProjectsUsingSVGWeb
// http://svgkit.sourceforge.net/SVGKit.html
//
if (!this.drawIcon) {
	var drawIcon = function() {
		var bWebkit = RegExp(" AppleWebKit/").test(navigator.userAgent);
		var sDefaultColor = "#C2B59B";
		var sDefaultBgColor = "#888888";
		var o = {
			 PLAY:			"play"
			,PAUSE:			"pause"
			,BACKWARD:		"backward"
			,FORWARD:		"forward"
			,PREVIOUS:		"previous"
			,NEXT:			"next"
			,STOP:			"stop"
			,RECORD:		"record"
			,EJECT:			"eject"
			,VOLUME:		"volume"
			,RESIZE:		"resize"
			,CLOSE:			"close"
			,toString: function() {
				return "[object drawIcon]";
			}
			,constructor:	null
		};
		var icon = {};
		icon[o.PLAY] = "asdf";
		//
		var svgString = function svgString(type,color,bg) {
			if (color===undefined) color = sDefaultColor;
			if (bg===undefined) bg = sDefaultBgColor;
			//
			//var sSvg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">';
			//var sSvg = '<svg version="1.1" svg xmlns="http://www.w3.org/2000/svg">';
			var sSvg = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" overflow="hidden">';
			//if (bWebkit) sSvg += '<rect fill="'+bg+'" width="100" height="100" />';
			switch (type) {
				case o.PLAY:
					sSvg += '<polygon fill="'+color+'" class="fill" points="10,10 90,50 10,90 "/>';
					sSvg += '<polygon opacity="0.54" fill="#FFF" points="10,10 90,50 80,50 14.375,17.125 "/>';
					sSvg += '<polygon opacity="0.32" fill="#FFF" points="10,10 14.375,17.125 14.375,83.375 10,90 "/>';
					sSvg += '<polygon opacity="0.26" fill="#000" points="10,90 14.375,83.375 80,50 90,50 "/>';
				break;
				case o.PAUSE:
					sSvg += '<rect x="10" y="10" fill="'+color+'" width="30" height="80"/>';
					sSvg += '<rect x="60" y="10" fill="'+color+'" width="30" height="80"/>';
					sSvg += '<polygon opacity="0.2" fill="#FFF" points="15,15 10,10 10,90 14.938,85 "/>';
					sSvg += '<polygon opacity="0.3" fill="#000" points="10,90 40,90 35,85 14.938,85 "/>';
					sSvg += '<polygon opacity="0.5" fill="#FFF" points="40,10 10,10 15,15 35.063,15 "/>';
					sSvg += '<polygon opacity="0.1" fill="#000" points="35,85 40,90 40,10 35.063,15 "/>';
					sSvg += '<polygon opacity="0.2" fill="#FFF" points="65,15 60,10 60,90 64.938,85 "/>';
					sSvg += '<polygon opacity="0.3" fill="#000" points="60,90 90,90 85,85 64.938,85 "/>';
					sSvg += '<polygon opacity="0.5" fill="#FFF" points="90,10 60,10 65,15 85.063,15 "/>';
					sSvg += '<polygon opacity="0.1" fill="#000" points="85,85 90,90 90,10 85.063,15 "/>';
				break;
				case o.STOP:
					sSvg += '<rect x="10" y="10" fill="'+color+'" width="80" height="80"/>';
					sSvg += '<polygon opacity="0.2" fill="#FFF" points="15,15 10,10 10,90 15,85 "/>';
					sSvg += '<polygon opacity="0.1" fill="#000" points="85,85 90,90 90,10 85,15 "/>';
					sSvg += '<polygon opacity="0.5" fill="#FFF" points="85,15 90,10 10,10 15,15 "/>';
					sSvg += '<polygon opacity="0.3" fill="#000" points="15,85 10,90 90,90 85,85 "/>';
				break;
				case o.VOLUME:
					sSvg += '<circle fill="'+color+'" cx="50" cy="50" r="10"/>';
					sSvg += '<rect x="2.667" y="104" fill="'+color+'" width="30" height="80"/>';
					sSvg += '<polygon fill="'+color+'" points="42.667,104 82.667,144 42.667,184 "/>';
				break;
				case o.RESIZE:
					sSvg += '<rect x="10" y="65" fill="'+color+'" width="30" height="25"/>';
					sSvg += '<rect x="20" y="10" fill="'+color+'" width="70" height="50"/>';
					sSvg += '<polygon opacity="0.2" fill="#FFF" points="15,70 10,65 10,90 14.938,85 "/>';
					sSvg += '<polygon opacity="0.3" fill="#000" points="10,90 40,90 35,85 14.938,85 "/>';
					sSvg += '<polygon opacity="0.5" fill="#FFF" points="40,65 10,65 15,70 35.063,70 "/>';
					sSvg += '<polygon opacity="0.1" fill="#000" points="35,85 40,90 40,65 35.063,70 "/>';
					sSvg += '<polygon opacity="0.2" fill="#FFF" points="25,15 20,10 20,60 24.938,55 "/>';
					sSvg += '<polygon opacity="0.3" fill="#000" points="20,60 90,60 85,55 24.938,55 "/>';
					sSvg += '<polygon opacity="0.5" fill="#FFF" points="90,10 20,10 25,15 85.063,15 "/>';
					sSvg += '<polygon opacity="0.1" fill="#000" points="85,55 90,60 90,10 85.063,15 "/>';
				break;
				default:
					sSvg += '<path fill="'+color+'" d="M10,40h10l27-30h3c0,0,3,10,3,40s-3,40-3,40h-3L20,60H10V40z" />';
			}
			sSvg += '</svg>';
			return sSvg;
		}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//		// webkit has bug on inling svg with transparency (==white)
//		o.svg = function(type,color,bg){ // transparency and scaling/overflow sucks on chrome
//			if (color===undefined) color = sDefaultColor;
//			if (bg===undefined) bg = sDefaultBgColor;
//			var oSvg = document.createElement('object');
//			oSvg.width = "100%";
//			oSvg.height = "100%";
//			oSvg.setAttribute('type', 'image/svg+xml');
//			oSvg.setAttribute('data', 'data:image/svg+xml,'+ svgString(type,color,bg));
//			return oSvg;
//		}
//		o.asdf = function(type,w,h,canvas){
//			return svgString(type);
//		}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
		o.canvas = function(type,w,h,color,canvas,x,y){
			if (!canvas) {
				canvas = document.createElement('canvas');
				canvas.width = w;
				canvas.height = h;
			}
			if (!x) x = 0;
			if (!y) y = 0;
			trace("w: "+w);
			svg2canvas(svgString(type,color),canvas,w/100,x,y);
			return canvas;
		}

		var svg2canvas = function svg2canvas(svg,canvas,scale,x,y){
			var xSvg = (new DOMParser()).parseFromString(svg, 'image/svg+xml');//"text/xml");
			// weirdly commas in attribute values are converted to spaces while casting strings to xml
			oContext = canvas.getContext("2d");
			recurse(oContext,xSvg.firstChild,scale,x,y);
			oContext.restore();
		};
		var recurse = function recurse(context,node,scale,x,y){
			for (var i=0;i<node.childNodes.length;i++) {
				var xNode = node.childNodes[i];
				var oAttr = nodeAttributes(xNode);
				context.beginPath();
				if (oAttr.fill) context.fillStyle = oAttr.fill;
				if (oAttr.opacity) context.globalAlpha = oAttr.opacity;
				switch (xNode.nodeName) {
					case 'rect':
						context.rect(x+scale*oAttr.x,y+scale*oAttr.y,scale*oAttr.width,scale*oAttr.height);
					break;
					case 'circle':
						context.arc(x+scale*oAttr.cx,y+scale*oAttr.cy,scale*oAttr.r,0,2*Math.PI);
					break;
					case 'polygon':
						var aPoints = oAttr.points.split(" ");
						for (var j=0;j<aPoints.length-1;j+=2) { // weirdly commas are converted to spaces while casting strings to xml
							if (j===0)	context.moveTo(x+scale*aPoints[j],y+scale*aPoints[j+1]);
							else		context.lineTo(x+scale*aPoints[j],y+scale*aPoints[j+1]);
						}
					break;
					default:
						context.fillStyle = "rgba(255,0,0,.5)";
						context.arc(scale*50,scale*50,scale*40,0,2*Math.PI);
				}
				context.fill();
				context.closePath();
				if (xNode.childNodes.length>0) recurse(context,xNode,scale);
			}
		};
		var nodeAttributes = function nodeAttributes(node){
			var o = {};
			for (var j=0;j<node.attributes.length;j++) {
				var xAttr = node.attributes[j];
				o[xAttr.name] = xAttr.value;
			}
			return o;
		}
		return o;
	}();
}