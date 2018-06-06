var catDsgSpWp1003NewsAndHighlights = window.catDsgSpWp1003NewsAndHighlights || {};
catDsgSpWp1003NewsAndHighlights.SlideCount = 0;
catDsgSpWp1003NewsAndHighlights.InitializeSlideShow = function (controlDiv) {
	if (!controlDiv.timer) {
		catDsgSpWp1003NewsAndHighlights.SetSlideStatus(controlDiv.children[0].children[0], controlDiv.children[3].children[0], true);
		var timer = document.createAttribute("timer");
		controlDiv.setAttributeNode(timer);
		catDsgSpWp1003NewsAndHighlights.AddSlideShowMouseHandlers(controlDiv);
		var numResults = catDsgSpWp1003NewsAndHighlights.SlideCount;
		if (catDsgSpWp1003NewsAndHighlights._slideShowCount===undefined||catDsgSpWp1003NewsAndHighlights._slideShowCount===null) {
			catDsgSpWp1003NewsAndHighlights._slideShowCount = {};
		}
		catDsgSpWp1003NewsAndHighlights._slideShowCount[controlDiv.id] = numResults;
		var startIndex = 0;
		catDsgSpWp1003NewsAndHighlights.ChangeSlideShow(controlDiv, startIndex);
		catDsgSpWp1003NewsAndHighlights.HandleSlideShowTimer(controlDiv, startIndex);
	}
};
catDsgSpWp1003NewsAndHighlights.AddSlideShowMouseHandlers = function (slideshow) {
	if (slideshow===undefined || slideshow===null || slideshow.children===undefined || slideshow.children===null || slideshow.children.length == 0 ||
		slideshow.children[0].children===undefined || slideshow.children[0].children===null || slideshow.children[0].children.length == 0) {
		return;
	}
	var slideItems = slideshow.children[0].children;
	for (var slideNum = 0; slideNum < slideItems.length; slideNum++) {
		(function () {
			var currentSlideNumber = slideNum;
			var slideItem = slideItems[currentSlideNumber];
			catDsgSpWp1003NewsAndHighlights.AddEventListener(slideItem, 'mouseover', function () { clearTimeout(slideshow.timer); });
			catDsgSpWp1003NewsAndHighlights.AddEventListener(slideItem, 'mouseout', function () { catDsgSpWp1003NewsAndHighlights.ChangeSlideShow(slideshow, currentSlideNumber); });
		})();
	}
};
catDsgSpWp1003NewsAndHighlights.HandleSlideShowTimer = function (controlDiv, currentIdx) {
	var TimerDelayMilliSeconds = 8000;
	if (controlDiv===undefined || controlDiv===null || controlDiv.children.length == 0) {
		setTimeout(function () { catDsgSpWp1003NewsAndHighlights.HandleSlideShowTimer(controlDiv, currentIdx); controlDiv = null; currentIdx = null; }, TimerDelayMilliSeconds);
		return;
	}
	currentIdx += 1;
	var numResults = catDsgSpWp1003NewsAndHighlights._slideShowCount[controlDiv.id];
	if (currentIdx >= numResults) {
		currentIdx = 0;
	}
	else if (currentIdx < 0) {
		currentIdx = numResults - 1;
	}
	clearTimeout(controlDiv.timer);
	controlDiv.timer = setTimeout(function () { catDsgSpWp1003NewsAndHighlights.ChangeSlideShow(controlDiv, currentIdx); controlDiv = null; currentIdx = null; }, TimerDelayMilliSeconds);
};
catDsgSpWp1003NewsAndHighlights.SlideShow_OnClick = function (target, idx) {
	var slideshow = target.parentNode.parentNode;
	clearTimeout(slideshow.timer);
	catDsgSpWp1003NewsAndHighlights.ChangeSlideShow(slideshow, idx);
};
catDsgSpWp1003NewsAndHighlights.ChangeSlideShow = function (slideshow, slideIndex) {
	if (slideshow===undefined || slideshow===null) { return; }
	if (slideshow.children===undefined || slideshow.children===null || slideshow.children.length == 0) { catDsgSpWp1003NewsAndHighlights.HandleSlideShowTimer(slideshow, slideIndex); return; }
	var slideItems = slideshow.children[0].children;
	var buttonItems = slideshow.children[3].children;
	var numResults = slideItems.length;
	for (var k = 0; k < numResults; k++) {
		if (k == slideIndex) { continue; }
		var buttonElement = k < buttonItems.length ? buttonItems[k] : null;
		catDsgSpWp1003NewsAndHighlights.SetSlideStatus(slideItems[k], buttonElement, false);
	}
	if (slideIndex >= 0 && slideIndex < numResults) {
		var buttonElement = slideIndex < buttonItems.length ? buttonItems[slideIndex] : null;
		catDsgSpWp1003NewsAndHighlights.SetSlideStatus(slideItems[slideIndex], buttonElement, true);
	}
	catDsgSpWp1003NewsAndHighlights.HandleSlideShowTimer(slideshow, slideIndex);
};
catDsgSpWp1003NewsAndHighlights.SetSlideStatus = function (slideElement, buttonElement, isActive) {
	if (slideElement != undefined && slideElement != null) {
		slideElement.style.display = isActive ? "block" : "none";
	}
	if (buttonElement != undefined && buttonElement != null) {
		var activeButtonClassName = "catDsgSpWp1003NewsAndHighlights-SlideshowPagingLink-Active";
		var inactiveButtonClassName = "catDsgSpWp1003NewsAndHighlights-SlideshowPagingLink-Inactive";
		var oldClassName = isActive ? inactiveButtonClassName : activeButtonClassName;
		var newClassName = isActive ? activeButtonClassName : inactiveButtonClassName;
		buttonElement.className = buttonElement.className.replace(oldClassName, newClassName);
	}
};
catDsgSpWp1003NewsAndHighlights.cbs_getStyle = function (element, propertyName) {
	var styleValue = null;
	if (element===undefined || element===null) { return styleValue; }
	if (element.currentStyle) {
		styleValue = element.currentStyle[propertyName];
	}
	else if (window.getComputedStyle) {
		styleValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propertyName);
	}
	return styleValue;
};
catDsgSpWp1003NewsAndHighlights.AddEventListener = function (element, eventName, func) {
	if (element!=undefined &&element!=null && eventName!=undefined && eventName!='' && eventName!=null && func!=undefined && func!=null) {
		if (element.addEventListener!=undefined && element.addEventListener!=null) {
			element.addEventListener(eventName, func);
		}
		else if (element.attachEvent!=undefined && element.attachEvent!=null) {
			eventName = eventName.indexOf("on") == 0 ? eventName : "on" + eventName;
			element.attachEvent(eventName, func);
		}
	}
};
module.exports = catDsgSpWp1003NewsAndHighlights;
