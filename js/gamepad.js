var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if (is_firefox) {
    console.log(navigator.userAgent);
} else {
    alert("Please use the latest version of Firefox.");
}

var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
    addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad;
    console.log("added gamepad " + gamepad.id);
    rAF(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    delete controllers[gamepad.index];
}

function updateStatus() {
    scangamepads();
    for (j in controllers) {
        var controller = controllers[j];
        for (var i = 0; i < controller.buttons.length; i++) {
            var val = controller.buttons[i];
            var pressed = val == 1.0;
            if (typeof (val) == "object") {
                pressed = val.pressed;
                val = val.value;
            }
            if (pressed) {
                console.log("button " + i + " pressed");

                switch (i) {
                    case 0:
                        // w
                        move(1, 90);
                        break;
                    case 1:
                        // d
                        move(1, 180);
                        break;
                    case 2:
                        // s
                        move(1, 270);
                        break;
                    case 3:
                        // a
                        move(1, 0);
                        break;
                    case 4:
                        // q
                        turnArrow(-1);
                        break;
                    case 5:
                        // e
                        turnArrow(1);
                        break;
                }
            }
        }
    }
    rAF(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (!(gamepads[i].index in controllers)) {
                addgamepad(gamepads[i]);
            } else {
                controllers[gamepads[i].index] = gamepads[i];
            }
        }
    }
}

if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
    setInterval(scangamepads, 500);
}