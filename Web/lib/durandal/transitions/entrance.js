﻿define(['../system', 'jquery', 'knockout'],
function (system, $, ko) {

    var fadeOutDuration = 100;
    var endValues = {
        marginRight: 0,
        marginLeft: 0,
        opacity: 1
    };
    var clearValues = {
        marginLeft: '',
        marginRight: '',
        opacity: '',
        display: ''
    };

    var entrance = function(parent, newChild, settings) {
        return system.defer(function(dfd) {
            function endTransition() {
                dfd.resolve();
            }

            function scrollIfNeeded() {
                if (!settings.keepScrollPosition) {
                    $(document).scrollTop(0);
                }
            }

            if (!newChild) {
                scrollIfNeeded();

                if (settings.activeView) {
                    $(settings.activeView).fadeOut(fadeOutDuration, function () {
                        if (!settings.cacheViews) {
                            ko.virtualElements.emptyNode(parent);
                        }
                        endTransition();
                    });
                } else {
                    if (!settings.cacheViews) {
                        ko.virtualElements.emptyNode(parent);
                    }
                    endTransition();
                }
            } else {
                var $previousView = $(settings.activeView);
                var duration = settings.duration || 500;
                var fadeOnly = !!settings.fadeOnly;

                function startTransition() {
                    scrollIfNeeded();

                    if (settings.cacheViews) {
                        if (settings.composingNewView) {
                            ko.virtualElements.prepend(parent, newChild);
                        }
                    } else {
                        ko.virtualElements.emptyNode(parent);
                        ko.virtualElements.prepend(parent, newChild);
                    }

                    var startValues = {
                        marginLeft: fadeOnly ? '0' : '20px',
                        marginRight: fadeOnly ? '0' : '-20px',
                        opacity: 0,
                        display: 'block'
                    };

                    var $newChild = $(newChild);

                    $newChild.css(startValues);
                    $newChild.animate(endValues, duration, 'swing', function () {
                        $newChild.css(clearValues);
                        endTransition();
                    });
                }

                if ($previousView.length) {
                    $previousView.fadeOut(fadeOutDuration, startTransition);
                } else {
                    startTransition();
                }
            }
        }).promise();
    };

    return entrance;
});