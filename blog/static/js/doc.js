(function () {
 window.getQueryString = function (name, url = window.location.href) {
  if (!url || !name) return null
  var reg = new RegExp("([\?&])" + name + "=([^&]*)(&|$)", "i");
  var r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
 }

 window.siv = function (id) {
  let el
  if (id && (el = document.getElementById(id))) {
   el.scrollIntoView({ behavior: "smooth", })
  }
 }

 window.windowLoad = function (callback) {
  typeof callback === 'function' && callback()
 }

 window.onload = function () {
  var nav_items = document.querySelectorAll("#menu_tree  li > a")
  function setAActive (clicked_el) {
   nav_items.forEach(item => {
    if (item.classList.contains("active")) {
     item.classList.remove("active")
    }
   })
   clicked_el.classList.add("active")
  }
  let timer1
  nav_items.forEach(el => {
   el.addEventListener("click", function (ev) {
    removeWindowScrollListener()
    setAActive(el)

    siv(getQueryString("id", el.href))
    if (timer1) clearTimeout(timer1)
    timer1 = setTimeout(() => {
     addWindowScrollListener()
    }, 900)
   })
  })
  windowLoad()
  siv(getQueryString("id"))

  let timer = null
  function scrollListener () {
   if (timer) clearTimeout(timer)
   timer = setTimeout(() => {
    const top = document.documentElement.scrollTop || document.body.scrollTop;
    let flag = false
    for (let index = 0; index < nav_items.length; index++) {
     const cel = document.getElementById(getQueryString("id", nav_items[index].href))
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

  document.getElementById("fold_img").addEventListener("click", function (ev) {
   ev.stopPropagation()
   const mainel = document.getElementById("main")
   if (mainel.classList.contains("fold")) {
    mainel.classList.remove("fold")
   } else {
    mainel.classList.add("fold")
   }
  })

  const window_width = document.documentElement.clientWidth || document.body.clientWidth || document.body.offsetWidth || 0
  if (window_width < 500) {
   const mainel = document.getElementById("main")
   mainel.classList.add("fold")
   mainel.addEventListener("click", function (ev) {
    this.classList.add("fold")
   })
  }
 }
})()