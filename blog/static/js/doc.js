function siv(id) {
 let el
 if (id && (el = $(`#${id}`))) {
  if(el[0])  el[0].scrollIntoView({ behavior: "smooth", })
 }
}

$(document).ready(function() {
 var nav_items = $("#menu_tree  li > a")
 function setAActive (clicked_el) {
  for(let i =0; i< nav_items.length ;i++) {
   if ($(nav_items[i]).hasClass("active")) {
    $(nav_items[i]).removeClass("active")
    break
   }
  }
  $(clicked_el).addClass("active")
 }
 let timer1

 for(let i=0;i<nav_items.length;i++ ) {
      $(nav_items[i]).click(function(ev) {
       removeWindowScrollListener()
       setAActive(this)
       siv(getQueryString("id", $(this).attr("href")))
       if (timer1) clearTimeout(timer1)
       timer1 = setTimeout(() => {
        addWindowScrollListener()
       }, 900)
      })

 }

 siv(getQueryString("id"))

 let timer = null
 function scrollListener () {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
   const top = document.documentElement.scrollTop || document.body.scrollTop;
   let flag = false
   for (let index = 0; index < nav_items.length; index++) {
    const cel = $(`#${getQueryString("id", nav_items[index].href)}`)[0]
    if (!cel) {
     continue
    }
    const oft = cel.offsetTop
    const ofh = cel.offsetHeight
    if (nav_items[index + 1]) {
     const id = getQueryString("id", nav_items[index + 1].href)
     const nextoft = document.getElementById(id).offsetTop

     if (top >= oft - ofh && top < nextoft) {
      setAActive(nav_items[index])
      flag = true
      break
     }
    } else {
     setAActive(nav_items[index])
     flag = true
     break
    }
   }
   if (!flag) {
    setAActive(nav_items[0])
   }
  }, 5)


 }
 function addWindowScrollListener () {
  window.addEventListener("scroll", scrollListener)
 }

 function removeWindowScrollListener () {
  window.removeEventListener("scroll", scrollListener)
 }

 addWindowScrollListener()

 const window_width = document.documentElement.clientWidth || document.body.clientWidth || document.body.offsetWidth || 0
 if (window_width < 500) {
  $("#main").addClass("fold").click(function (ev) {
   $(this).addClass("fold")
  })
 }
})

