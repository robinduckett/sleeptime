Controller = require 'controllers/base/controller'
HomePageView = require 'views/home-page-view'

module.exports = class HomeController extends Controller
  index: ->
    ((a, b, c) ->
      if c of b and b[c]
        d = undefined
        e = a.location
        f = /^(a|html)$/i
        a.addEventListener "click", ((a) ->
          d = a.target
          d = d.parentNode  until f.test(d.nodeName)
          "href" of d and (d.href.indexOf("http") or ~d.href.indexOf(e.host)) and (a.preventDefault()
          e.href = d.href
          )
        ), not 1
    ) document, window.navigator, "standalone"

    window.addEventListener "load", ->
      setTimeout (->
        window.scrollTo 0, 1
      ), 0

    setInterval (=>
      @_updateTimes()
    ), 1000

    @view = new HomePageView region: 'main'

    @_updateTimes()

    $('#time').val(moment().format('HH:mm:ss'))

    $('#time').change( =>
      @_updateTimes(moment().format('YYYY-MM-DD ') + $('#time').val())
    )

    $('#bedtime-button').click () =>
      @_updateTimes(moment().format('YYYY-MM-DD ') + $('#time').val())
      $('#bedtime').toggle()
      $('#nowbedtime').toggle()

      if $('#bedtime:visible').length > 0
        $('#bedtime-button').html('I want to go to bed now');
      else
        $('#bedtime-button').html('I know my bed time');

  _updateTimes: (time) =>

    pos = ''

    times =
      now: moment(time)

    if typeof time isnt "undefined"
      pos = 'bottom'

    for num in [1..6]
      if num is 1
        times["#{pos}slot#{num}"] = moment(times.now).add('minutes', 90)
        times["#{pos}slot#{num}"].add('minutes', 14)
      else
        less = num - 1
        times["#{pos}slot#{num}"] = moment(times["#{pos}slot#{less}"]).add('minutes', 90)

    for key, value of times
      if key isnt 'now' or typeof time is "undefined"
        $(".#{key}").html(value.format('h:mm a'))
