// method
Function.prototype.method = function(name,func) {
	if (!this.prototype[name]) {
		this.prototype[name] = func;
		return this;
	}
};

// DOMReady
if (!window.onDOMReady) {
	window.onDOMReady = function (fn)  { 
		if (document.addEventListener) document.addEventListener("DOMContentLoaded", fn, false);
		else document.onreadystatechange = function() { checkReadyState(fn); };
	}
}
if (!this.checkReadyState) {
	function checkReadyState(fn) {
		if (document.readyState == "interactive")  fn();
	}
}

// findPos
if (!this.elementPos) {
	var elementPos = function elementPos(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		return {x:curleft,y:curtop};
	};
}

// mousePos
if (!this.mousePos) {
	var mousePos = function mousePos(e) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return {x:posx,y:posy};
	};
}

// addChild
//if (!this.addChild) {
//	var addChild = function(p,s) {
//		var m = document.createElement(s);
//		p.appendChild(m);
//		return m;
//	};
//}
//
if (!this.addChild) {
	var addChild = function(parent,elementName,append) {
		var m = document.createElement(elementName);
		if (append===true) parent.appendChild(m);
		else parent.insertBefore(m, parent.firstChild);
		return m;
	};
}

// trace
if (!this.trace) {
	var trace = function trace(o) {
		if (window.console&&window.console.log) {
			var sTrace = "";
			if (arguments.length===1&&typeof(o)!=='string') {
				sTrace += o+"\n";
				for (var prop in o) {
					if (true) {
						sTrace += "\t"+prop+":\t"+String(o[prop]).split("\n")[0]+"\n";
					}
				}
			} else {
				for (var i=0;i<arguments.length;i++) {
					if (typeof(arguments[i])!=='function') {
						sTrace += " "+String(arguments[i]);
					}
				}
			}
			window.console.log(sTrace);
			return sTrace;
		}
	};
}

// grace
if (!this.grace) {
	var grace = function grace(o) {
		var sTrace = trace.apply(this,arguments);
		document.write(sTrace.replace(/\n/gi,"<br/>").replace(/\t/gi,"&nbsp; &nbsp; ")+"<br/>");
		return sTrace;
	};
}

// int
if (!this.int) {
	var int = function(i) {
		return Math.round(i);
	};
}

// millis
if (!this.millis) {
	var millis = function() {
		return new Date().getTime();
	};
}

// FastRng
if (!this.Prng) {
	var Prng = function() {
		var iMersenne = 2147483647;
		var rnd = function(seed) {
			if (arguments.length) {
				that.seed = arguments[0];
			}
			that.seed = that.seed*16807%iMersenne;
			return that.seed;
		};
		var that = {
			seed: 123,
			rnd: rnd,
			random: function(seed) {
				if (arguments.length) {
					that.seed = arguments[0];
				}
				return rnd()/iMersenne;
			}
		};
		return that;
	}();
}

// Color
if (!this.Color) {
	var Color = function () {
		var i,s,r,g,b,a,c;
		var i2hex = function i2hex(i){
			s = i.toString(16);
			return (s.length===1?"0":"")+s;
		};
		return {
			rgba2hex: function(r,g,b,a) {
				return i2hex(r)+i2hex(g)+i2hex(b)+i2hex(a);
			}
			,rgb2hex: function(r,g,b) {
				return i2hex(r)+i2hex(g)+i2hex(b);
			}

			,hex2rgb: function(s) {
				s = s.replace(/#/gi,"");
				i = s.length;
				if (i===8) {
					r = s.substr(0,2);
					g = s.substr(2,2);
					b = s.substr(4,2);
				 	a = s.substr(4,2);
				} else if (i===6) {
					r = s.substr(0,2);
					g = s.substr(2,2);
					b = s.substr(4,2);
				} else if (i===4) {
					r = s.substr(0,1);
					g = s.substr(1,1);
					b = s.substr(2,1);
				 	a = s.substr(3,1);
					r = r+r;
					g = g+g;
					b = b+b;
					a = a+a;
				} else {
					r = s.substr(0,1);
					g = s.substr(1,1);
					b = s.substr(2,1);
					r = r+r;
					g = g+g;
					b = b+b;
				}
				return i===8||i===4?{r:r,g:g,b:b,a:a}:{r:r,g:g,b:b};
			}
			,even: function(c1,c2) {
				return 1;
			}
		};
	}();
}
