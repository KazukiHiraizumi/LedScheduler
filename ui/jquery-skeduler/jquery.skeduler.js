(function ($) {
  var defaultSettings = {
    // Data attributes
    headers: [],  // String[] - Array of column headers
    tasks: [],    // Task[] - Array of tasks. Required fields: 
    // id: number, startTime: number, duration: number, column: number

    // Card template - Inner content of task card. 
    // You're able to use ${key} inside template, where key is any 9property from task.
    cardTemplate: '<div>${id}</div>',

    // OnClick event handler
    onClick: function (e, task) { },

    // Css classes
    containerCssClass: 'skeduler-container',
    headerContainerCssClass: 'skeduler-headers',
    schedulerContainerCssClass: 'skeduler-main',
    taskPlaceholderCssClass: 'skeduler-task-placeholder',
    cellCssClass: 'skeduler-cell',

    lineHeight: 30,      // height of one half-hour line in grid
    borderWidth: 1,      // width of board of grid cell

    debug: false
  };
  var settings = {};

  /**
   * Convert double value of hours to zero-preposited string with 30 or 00 value of minutes
   */
  function toTimeString(value) {
    let hour=Math.floor(value);
    let min=Math.floor((value-hour)*60);
    return hour + ':' + (min < 10 ? '0' : '') + min;
  }

  /**
   * Return height of task card based on duration of the task
   * duration - in hours
   */
  function getCardHeight(duration) {
    return (settings.lineHeight + settings.borderWidth) * (duration * 2) - 1;
  }

  /**
   * Return top offset of task card based on start time of the task
   * startTime - in hours
   */
  function getCardTopPosition(startTime) {
    return (settings.lineHeight + settings.borderWidth) * (startTime * 2);
  }

  /**
  * Render card template
  */
  function renderInnerCardContent(task) {
    var result = settings.cardTemplate;
    for (var key in task) {
      if (task.hasOwnProperty(key)) {
        // TODO: replace all
        result = result.replace('${' + key + '}', task[key]);
      }
    }

    return $(result);
  }

  /**
   * Generate task cards
   */
  function appendTasks(placeholder, tasks) {85
    var findCoefficients = function () {
      var coefficients = [];
      for (var i = 0; i < tasks.length - 1; i++) {
        var k = 0;
        var j = i + 1;
        while (j < tasks.length && tasks[i].startTime < tasks[j].startTime
          && tasks[i].startTime + tasks[i].duration > tasks[j].startTime) {
          k++;
          j++;
        }

        coefficients.push(k);
      }

      coefficients.push(0);
      return coefficients;
    };

    var normalize = function (args) {
      var indexes = {};
      for (var i = 0; i < args.length; i++) {
        var start = i;
        var count = 0;
        while (args[i] != 0) {
          i++;
          count++;
        }
        var end = i;
        if (count) {
          count++;
        }

        var index = 0;
        for (var j = start; j <= end; j++) {
          args[j] = count;
          indexes[j] = index++;
        }
      }

      return {args: args, indexes: indexes};
    };

    var args =
      normalize(
        findCoefficients()
      );

/*    for (var i = 0; i < args.args.length; i++) {
      var width = 100 / (args.args[i] || 1);

      tasks[i].width = width;
      tasks[i].left = (args.indexes[i] * width) || 4;
    }*/

    tasks.forEach(function (task, index) {
      var innerContent = renderInnerCardContent(task);
      var top = getCardTopPosition(task.startTime) + 2;
      var height = getCardHeight(task.duration);
      var width = task.width || 100;
      var left = task.left || 4;

      var card = $('<div></div>')
       .attr({
          style: 'top: '+top+'px; height: '+(height-4)+'px; '+'width: '+(width-8)+'px; left: '+left+'px',
          title: toTimeString(task.startTime)
        });
      card.on('click', function (e) {
        e.stopPropagation();
        settings.onClick && settings.onClick(e,{task:task,card:card})
       });
      card.append(innerContent).appendTo(placeholder);
      card.updateAttr=function(obj){
        this.css({'top':getCardTopPosition(obj.startTime)+'px'});
        this.find('div').text(obj.value+'%');
        this.attr({'title':toTimeString(obj.startTime)});
       }
    }, this);
  }

  /**
  * Generate scheduler grid with task cards
  * options:
  * - headers: string[] - array of headers
  * - tasks: Task[] - array of tasks
  * - containerCssClass: string - css class of main container
  * - headerContainerCssClass: string - css class of header container
  * - schedulerContainerCssClass: string - css class of scheduler
  * - lineHeight - height of one half-hour cell in grid
  * - borderWidth - width of border of cell in grid
  */


  $.fn.skeduler = function (options) {
    settings = $.extend(defaultSettings, options);
    console.log('skeduler calles',settings);
    if (settings.debug) {
      console.time('skeduler');
    }

    var skedulerEl = $(this);

    skedulerEl.empty();
    skedulerEl.addClass(settings.containerCssClass);

    var div = $('<div></div>');

    // Add headers
//    var headerContainer = div.clone().addClass(settings.headerContainerCssClass);
//   settings.headers.forEach(function (element) {
//      div.clone().text(element).appendTo(headerContainer);
//    }, this);
//    skedulerEl.append(headerContainer);

    // Add schedule
    var scheduleEl = div.clone().addClass(settings.schedulerContainerCssClass).css({'height':settings.lineHeight});
    var scheduleTimelineEl = div.clone().addClass(settings.schedulerContainerCssClass + '-timeline');
    var scheduleBodyEl = div.clone().addClass(settings.schedulerContainerCssClass + '-body').css({'height':settings.lineHeight});

    var gridColumnElement = div.clone();

    scheduleTimelineEl.css({'background-color':'#777777'});
    for (var i = 0; i < 24; i++) {
      // Populate timeline85
      div.clone()
        .text(i)
        .css({'font-size':'x-large','font-style':'italic','height':(settings.lineHeight-1)*2})
        .appendTo(scheduleTimelineEl);
      gridColumnElement.append(div.clone().addClass(settings.cellCssClass));
      gridColumnElement.append(div.clone().addClass(settings.cellCssClass));
    }

    // Populate grid
    for (var j = 0; j < settings.headers.length; j++) {
      var el = gridColumnElement.clone();
      var placeholder = div.clone().addClass(settings.taskPlaceholderCssClass);
      appendTasks(placeholder, settings.tasks.filter(function (t) { return t.column == j }));
      el.prepend(placeholder);
      el.appendTo(scheduleBodyEl);
      el.on('click', {column:j,tasks:settings.tasks}, function(e){  //OnCreate callback
        var elm = $(this);
        var yPos = e.pageY - elm.offset().top;
        Object.assign(e.data,{yPos:yPos})
        settings.onCreate && settings.onCreate(e,e.data);
       });
    }

    scheduleEl.append(scheduleTimelineEl);
    scheduleEl.append(scheduleBodyEl);

    skedulerEl.append(scheduleEl);

    if (settings.debug) {
      console.timeEnd('skeduler');
    }

/*   setTimeout(function(){
     var ofs=scheduleEl.offset();
     var wid=scheduleEl.width();
     var hig=getCardTopPosition(24)-getCardTopPosition(0);
     console.log('width'+wid+' '+hig);
     var tlcan=$('<canvas style="position:relative;" id="tlcan"></canvas>');
     scheduleEl.append(tlcan);
     tlcan.offset(ofs);
     tlcan.width=wid;
     tlcan.height=hig;
     var c = document.getElementById("tlcan");
     var ctx = c.getContext("2d");
     var date=new Date();
     var tm=date.getHours()+date.getMinutes()/60;
     var pos=getCardTopPosition(tm);
     console.log('canvas draw '+tm+' '+pos);
     ctx.moveTo(0, 0);
     ctx.lineTo(wid, hig);
     ctx.stroke();
    },1000);*/
   return skedulerEl;
  };
}(jQuery));
