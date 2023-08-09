$(document).ready(function() {
    function getQueryString (name, url = window.location.href) {
        if (!url || !name) return null
        var reg = new RegExp("([\?&])" + name + "=([^&]*)(&|$)", "i");
        var r = url.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    function NewPointer(size, background) {
        var mouse_center = $("<div></div>")
        mouse_center.css("position", 'fixed')
        mouse_center.css("width" , `${size[0]}em`)
        mouse_center.css("height" , `${size[1]}em`)
        mouse_center.css("background" , background)
        mouse_center.css("transform" , 'translate(-50%, -50%)')
        mouse_center.css("border-radius" , '50%')
        mouse_center.css("pointer-events" , 'none')
        mouse_center.css("z-index" , 9999999999999999)
        $("body").append(mouse_center)
        return mouse_center
    }
    var active_background = "rgba(0,0,0,0.5)"
    var background = "rgba(0,0,0,0.3)"
    var center_background = "#fff"
    var size = [ 0.9, 0.9], center_size = [0.55,0.55]

    var pointer_bac = NewPointer(size, background)
    var pointer_center = NewPointer(center_size, center_background)

    $(document).mousemove(function(ev) {
        setTimeout(() => {
            pointer_bac.css("top", ev.clientY)
            pointer_bac.css("left", ev.clientX)
        }, 30)


        pointer_center.css("top", ev.clientY)
        pointer_center.css("left", ev.clientX)
    })
    $(document).mousedown(function(ev) {
        pointer_bac.css("background", active_background)
    })
    $(document).mouseup(function(ev) {
        pointer_bac.css("background", background)
    })

    // var message = getQueryString("message")
    // console.log(message)
    // if(message) {
    //     alert(decodeURIComponent(message))
    // }
})
