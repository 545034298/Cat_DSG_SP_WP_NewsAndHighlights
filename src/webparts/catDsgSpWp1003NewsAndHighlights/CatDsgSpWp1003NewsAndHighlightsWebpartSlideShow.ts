export default class SlideShow {
	public static slideCount: number = 0;
	public static slideShowCount: any = undefined;
	public static activeSlideButtonClassName:string='';
	public static inactiveSlideButtonClassName:string='';
	public static initializeSlideShow(controlDiv) {
		if (!controlDiv.timer) {
			SlideShow.setSlideStatus(controlDiv.children[0].children[0], controlDiv.children[3].children[0], true);
			var timer = document.createAttribute("timer");
			controlDiv.setAttributeNode(timer);
			SlideShow.addSlideShowMouseHandlers(controlDiv);
			var numResults = SlideShow.slideCount;
			if (SlideShow.slideShowCount === undefined || SlideShow.slideShowCount === null) {
				SlideShow.slideShowCount = {};
			}
			SlideShow.slideShowCount[controlDiv.id] = numResults;
			var startIndex = 0;
			SlideShow.changeSlideShow(controlDiv, startIndex);
			SlideShow.handleSlideShowTimer(controlDiv, startIndex);
		}
	}

	public static addSlideShowMouseHandlers(slideshow) {
		if (slideshow === undefined || slideshow === null || slideshow.children === undefined || slideshow.children === null || slideshow.children.length == 0 ||
			slideshow.children[0].children === undefined || slideshow.children[0].children === null || slideshow.children[0].children.length == 0) {
			return;
		}
		var slideItems = slideshow.children[0].children;
		for (var slideNum = 0; slideNum < slideItems.length; slideNum++) {
			(function () {
				var currentSlideNumber = slideNum;
				var slideItem = slideItems[currentSlideNumber];
				SlideShow.addEventListener(slideItem, 'mouseover', function () { clearTimeout(slideshow.timer); });
				SlideShow.addEventListener(slideItem, 'mouseout', function () { SlideShow.changeSlideShow(slideshow, currentSlideNumber); });
			})();
		}
	}

	public static handleSlideShowTimer(controlDiv, currentIdx) {
		var TimerDelayMilliSeconds = 8000;
		if (controlDiv === undefined || controlDiv === null || controlDiv.children.length == 0) {
			setTimeout(function () { SlideShow.handleSlideShowTimer(controlDiv, currentIdx); controlDiv = null; currentIdx = null; }, TimerDelayMilliSeconds);
			return;
		}
		currentIdx += 1;
		var numResults = SlideShow.slideShowCount[controlDiv.id];
		if (currentIdx >= numResults) {
			currentIdx = 0;
		}
		else if (currentIdx < 0) {
			currentIdx = numResults - 1;
		}
		clearTimeout(controlDiv.timer);
		controlDiv.timer = setTimeout(function () { SlideShow.changeSlideShow(controlDiv, currentIdx); controlDiv = null; currentIdx = null; }, TimerDelayMilliSeconds);
	}

	public static handleSlideButtonOnClickEvent(target, idx) {
		var slideshow = target.parentNode.parentNode;
		clearTimeout(slideshow.timer);
		SlideShow.changeSlideShow(slideshow, idx);
	}

	public static changeSlideShow(slideshow, slideIndex) {
		if (slideshow === undefined || slideshow === null) { return; }
		if (slideshow.children === undefined || slideshow.children === null || slideshow.children.length == 0) { SlideShow.handleSlideShowTimer(slideshow, slideIndex); return; }
		var slideItems = slideshow.children[0].children;
		var buttonItems = slideshow.children[3].children;
		var numResults = slideItems.length;
		for (var k = 0; k < numResults; k++) {
			if (k == slideIndex) { continue; }
			let buttonElement = k < buttonItems.length ? buttonItems[k] : null;
			SlideShow.setSlideStatus(slideItems[k], buttonElement, false);
		}
		if (slideIndex >= 0 && slideIndex < numResults) {
			let buttonElement = slideIndex < buttonItems.length ? buttonItems[slideIndex] : null;
			SlideShow.setSlideStatus(slideItems[slideIndex], buttonElement, true);
		}
		SlideShow.handleSlideShowTimer(slideshow, slideIndex);
	}

	public static setSlideStatus(slideElement, buttonElement, isActive) {
		if (slideElement != undefined && slideElement != null) {
			slideElement.style.display = isActive ? "block" : "none";
		}
		if (buttonElement != undefined && buttonElement != null) {
			var oldClassName = isActive ? SlideShow.inactiveSlideButtonClassName : SlideShow.activeSlideButtonClassName;
			var newClassName = isActive ? SlideShow.activeSlideButtonClassName : SlideShow.inactiveSlideButtonClassName;
			buttonElement.className = buttonElement.className.replace(oldClassName, newClassName);
		}
	}

	public static addEventListener(element, eventName, func) {
		if (element != undefined && element != null && eventName != undefined && eventName != '' && eventName != null && func != undefined && func != null) {
			if (element.addEventListener != undefined && element.addEventListener != null) {
				element.addEventListener(eventName, func);
			}
			else if (element.attachEvent != undefined && element.attachEvent != null) {
				eventName = eventName.indexOf("on") == 0 ? eventName : "on" + eventName;
				element.attachEvent(eventName, func);
			}
		}
	}

	public static getStyle(element, propertyName) {
		var styleValue = null;
		if (element === undefined || element === null) { return styleValue; }
		if (element.currentStyle) {
			styleValue = element.currentStyle[propertyName];
		}
		else if (window.getComputedStyle) {
			styleValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propertyName);
		}
		return styleValue;
	}
}




