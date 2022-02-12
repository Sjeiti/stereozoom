if (!this.stereoZoomer) {
	var stereoZoomer = function() {
		trace("Stereoviewer 0.1");
		var o = {
			 PLAY:			"play"
			,PAUSE:			"pause"
			,toString: function() {
				return "[object stereoZoomer]";
			}
			,constructor:	null
		};

		var fScl = .26;
		var fInvScl = 1/fScl;
		var iXoff = -.5;
		var iYoff = -.5;

		var iW = 800;
		var iH = 600;
		var mBody;
		var mPage;

		var mMaindDiv;
		var mDivL;
		var mDivR;

		var mCanvas;
		var oContext;
		var oImgData;

		var mImg = new Image();
		var iWi;
		var iHi;

		var mCanvasLo;
		var oContextLo;
		var mCanvasRo;
		var oContextRo;

		var mCanvasL;
		var oContextL;
		var mCanvasR;
		var mContextR;

		//var fMxW;
		//var fMxH;
		var fMx;

		o.init = function(parentId,w,h,photo){

				iW = w;
				iH = h;

				mBody = document.getElementsByTagName('body')[0];
				mPage = document.getElementById(parentId);

				mMaindDiv = addChild(mBody,'div');
				mMaindDiv.setAttribute("style","position:absolute;left:0;top:0;width:100%;height:100%;");
				mDivL = addChild(mMaindDiv,'div');
				mDivL.setAttribute("style","position:absolute;left:0;top:0;width:50%;height:100%;background:#444;");
				mDivR = addChild(mMaindDiv,'div');
				mDivR.setAttribute("style","position:absolute;left:50%;top:0;width:50%;height:100%;background:#888;");


				if (Stats) {
					var oStats = new Stats();
					var mStats = oStats.domElement;
					mStats.style.position = 'absolute';
					mStats.style.left = '0px';
					mStats.style.top = '0px';
					mBody.appendChild(mStats);
					setInterval( function(){oStats.update();}, 1000/60);
				}


				mCanvasL = document.createElement('canvas');
				mCanvasL.width = iW/2;
				mCanvasL.height = iH;
				oContextL = mCanvasL.getContext("2d");

				mCanvasR = document.createElement('canvas');
				mCanvasR.width = iW/2;
				mCanvasR.height = iH;
				mContextR = mCanvasR.getContext("2d");
				//
				mCanvas = addChild(mPage,'canvas');
				mCanvas.width = iW;
				mCanvas.height = iH;
				//
				oContext = mCanvas.getContext("2d")
				oImgData = oContext.getImageData(0,0,iW,iH);
				//
				oContext.fillStyle = "rgb(66,66,66)";
				oContext.fillRect(0,0,iW/2,iH);
				oContext.fill();
				oContext.fillStyle = "rgb(111,111,111)";
				oContext.fillRect(iW/2,0,iW/2,iH);
				oContext.fill();
				//
				mImg.onload = imgLoad;
				o.loadImg(photo);
				//
				//
		//		var mPageM = mPage.cloneNode(true);
		//		mPageM.setAttribute("style","position:absolute;left:"+iW/2+"px;top:0px;");
		//		mPageM.setAttribute("id","pageCopy");
		//		mPage.appendChild(mPageM);
//			};
		}

		// imgLoad
		o.loadImg = function(photo){
//		function loadImg(s) {
			mImg.src = photo;
		}
		function imgLoad(i) {
			iWi = mImg.width;
			iHi = mImg.height;
			//
			mDivL.style.backgroundImage = "url("+mImg.getAttribute("src")+")";
			mDivR.style.backgroundImage = "url("+mImg.getAttribute("src")+")";
			mDivL.style.backgroundSize = "150%";
			mDivR.style.backgroundSize = "150%";
			mDivL.style.backgroundPosition = "-10px -10px";
			mDivR.style.backgroundPosition = "-10px -10px";
			//
			mCanvasLo = document.createElement('canvas');
			mCanvasLo.width = iWi/2;
			mCanvasLo.height = iHi;
			oContextLo = mCanvasLo.getContext("2d");
			oContextLo.drawImage(mImg, 0,0, iWi,iHi);
			//
			mCanvasRo = document.createElement('canvas');
			mCanvasRo.width = iWi/2;
			mCanvasRo.height = iHi;
			oContextRo = mCanvasRo.getContext("2d");
			oContextRo.drawImage(mImg, -iWi/2,0, iWi,iHi);
			//
			fMx = Math.max(iW/iWi,iH/iHi);
			//
			draw();
		}

		function draw() {
			drawPhoto();
			drawHud();
		}

		function drawPhoto() {
			var iNw = Math.round(fScl*iWi/2);
			var iNh = Math.round(fScl*iHi);
			//
			var iNXoff = Math.min(Math.max(	Math.round(fScl*iXoff+iW/4),	-(iNw-iW/2)),	0);
			var iNYoff = Math.min(Math.max(	Math.round(fScl*iYoff+iH/2),	-(iNh-iH)),	0);
			//
			oContextL.drawImage(mCanvasLo,	iNXoff,iNYoff,iNw,iNh);
			mContextR.drawImage(mCanvasRo,	iNXoff,iNYoff,iNw,iNh);
			//
			oContext.drawImage(mCanvasL, 0,0,		iW/2,iH);
			oContext.drawImage(mCanvasR, iW/2,0,	iW/2,iH);
			//
			var fPrt = iNw/iWi;
			var sPerc = Math.round(fPrt*100)+"%";
			mDivL.style.backgroundSize = sPerc;
			mDivR.style.backgroundSize = sPerc;
			mDivL.style.backgroundPosition = iNXoff+"px "+iNYoff+"px";
			mDivR.style.backgroundPosition = (iNXoff-fPrt*(iWi/2))+"px "+iNYoff+"px";
		}

		function drawHud() {
		//	oContext.fillStyle = "rgb(255,255,255)";
		//	oContext.fillRect(	.25*iW+10,10,		22,22);
		//	oContext.fill();
		//	//
		//	oContext.fillStyle = "rgb(255,255,255)";
		//	oContext.fillRect(	.75*iW-10,10,	22,22);
		//	oContext.fill();
			//
		//	oContext.fillStyle = "rgb(255,255,255)";
		//	oContext.fillRect(	.75*iW-10,10,	22,22);
		//	oContext.fill();
			//
		//	oContext.fillStyle = "rgb(255,255,255)";
		//	oContext.fillRect(	.75*iW-10,10,	22,22);
		//	oContext.fill();
			//
			var iRds = .02*iW;
			var iHps = iRds + 10;
			circle(.25*iW+5,iHps,iRds,"#ffffff","#000000",+4);
			circle(.75*iW-5,iHps,iRds,"#ffffff","#000000",-4);

//			oContext.lineStyle();
//			drawIcon.canvas(drawIcon.PLAY, 20,20, "#ffffff",mCanvas, 10,iH/2);

		}

		function circle(x,y,r,c1,c2,xo) {
			if (!xo) xo = 0;
			var oGrad = oContext.createRadialGradient(x,y,0, x+xo,y,r);
			oGrad.addColorStop(0, c1);
			oGrad.addColorStop(1, c2);
			oContext.fillStyle = oGrad;
			oContext.beginPath();
			oContext.arc(x,y, r, 0,360, false);
			oContext.fill();
			oContext.closePath();
		}

		function zoom(i) {
			if (i>0)	fScl = Math.min(fScl*1.01,4);
			else		fScl = Math.max(fScl/1.01,fMx);
			fInvScl = 1/fScl;
			draw();
		}

		// mouseDown
		var oLstM = {x:0,y:0};
		var bDown = false;
		window.onmousedown = function(e) {
			oLstM = mousePos(e);
			bDown = true;
		};
		window.onmouseup = function(e) {
			bDown = false;
		};
		window.onmousemove = function(e) {
			if (bDown) {
				var oMps = mousePos(e);
				if (oLstM.x!=oMps.x||oLstM.y!=oMps.y) {
					var iDx = oMps.x-oLstM.x;
					var iDy = oMps.y-oLstM.y;
					iXoff = Math.min(Math.max( iXoff+fInvScl*iDx,		-iWi/2+fInvScl*iW/4),	-fInvScl*iW/4);
					iYoff = Math.min(Math.max( iYoff+fInvScl*iDy,		-iHi  +fInvScl*iH/2),	-fInvScl*iH/2);
					draw();
				}
				oLstM = oMps;
			}
		};

		// canvasPos
		var oCanvasPos;
		function canvasPos() {
			if (!oCanvasPos) oCanvasPos = elementPos(mCanvas);
			return oCanvasPos;
		};

		// onMouseWheelSpin
		function onMouseWheelSpin(e) {
			var oCp = canvasPos();
			var oMp = mousePos(e);
			var bInside = oMp.x>oCp.x&&oMp.x<(oCp.x+iW)&&oMp.y>oCp.y&&oMp.y<(oCp.y+iH);
			//trace(bInside+" "+iMx+" "+iMy+" "+oCp.x+" "+oCp.y);
			if (bInside) {
				if (!e) e = window.event;
				zoom(e.wheelDelta?((window.opera?-1:1)*e.wheelDelta):-e.detail);
				if ( e.preventDefault ) e.preventDefault();
				e.returnValue = false;
			}
		}
		if (window.addEventListener) window.addEventListener('DOMMouseScroll', onMouseWheelSpin, false);
		window.onmousewheel = document.onmousewheel = onMouseWheelSpin;
		//
		//
		//
		//
		return o;
	}();
}