/**
 * jquery-static-pager 1.0.1
 * 基于 jQuery 的静态数据分页组件
 * http://www.tperiod.com/
 * Copyright 2011 - 2019
 * Released under the MIT license.
 */
(function () {
  'use strict';
  var Pager;
  Pager = function (el, options) {
    this.$this = $(el);
    this.options = $.extend(true, {}, Pager['DEFAULTS'], options);
    this.init();
  };
  Pager.prototype = {
    init: function () {
      this.current = this.options.current || 1;
      this.pageTotal = Math.ceil(this.options.total / this.options.size);
      this.ellipsis = this.pageTotal > this.options.span;
      this.ellipsisSumPrev = this.options.span; 
      this.ellipsisSumNext = this.pageTotal - this.options.span; 
      this.create();
    },
    create: function () {
      var isSimple = this.options.mode === 'simple';
      var isLite = this.options.mode === 'lite';
      var span = this.options.span;
      var lang = this.options.lang;
      var total = this.options.total;
      var pageTotal = this.pageTotal;
      this.$this.empty();
      if (pageTotal > 1) {
        this.$first = $('<a>')
          .text(isSimple ? '<<' : lang.first)
          .attr({
            href: 'javascript: void(0);',
            title: lang.pump.replace('%d%', 1),
          })
          .toggleClass('adorn', isSimple)
          .toggleClass('disabled', this.current <= 1)
          .on('click', $.proxy(function () {
            if (this.current === 1) return;
            this.change(1);
          }, this))
          .appendTo(this.$this);
        this.$prev = $('<a>')
          .text(isSimple ? '<' : lang.prev)
          .attr({
            href: 'javascript: void(0);',
            title: lang.prev,
          })
          .toggleClass('adorn', isSimple)
          .toggleClass('disabled', this.current <= 1)
          .on('click', $.proxy(function () {
            if (this.current === 1) return;
            this.change(this.current - 1);
          }, this))
          .appendTo(this.$this);
        if (!isLite) {
          this.$ellipsisPrev = $('<a>')
            .attr({
              href: 'javascript: void(0);',
              title: lang.ellipsisPrev.replace('%d%', span),
            })
            .text('···')
            .toggle(this.ellipsis && this.current > this.ellipsisSumPrev)
            .on('click', $.proxy(function () {
              var _page = this.current -= span;
              if (_page < 0) return;
              this.change(_page);
            }, this))
            .appendTo(this.$this);
        }
        this.$this.append(this.pages(this.current));
        if (!isLite) {
          this.$ellipsisNext = $('<a>')
            .attr({
              href: 'javascript: void(0);',
              title: lang.ellipsisNext.replace('%d%', span),
            })
            .text('···')
            .toggle(this.ellipsis && this.current < this.ellipsisSumNext)
            .on('click', $.proxy(function () {
              var _page = this.current += span;
              if (_page > pageTotal) return;
              this.change(_page);
            }, this))
            .appendTo(this.$this);
        }
        this.$next = $('<a>')
          .attr({
            href: 'javascript: void(0);',
            title: lang.next,
          })
          .toggleClass('adorn', isSimple)
          .toggleClass('disabled', this.current >= pageTotal)
          .text(isSimple ? '>' : lang.next)
          .on('click', $.proxy(function () {
            if (this.current === pageTotal) return;
            this.change(this.current += 1);
          }, this))
          .appendTo(this.$this);
        this.$end = $('<a>')
          .attr({
            href: 'javascript: void(0);',
            title: lang.end,
          })
          .toggleClass('adorn', isSimple)
          .toggleClass('disabled', this.current >= pageTotal)
          .text(isSimple ? '>>' : lang.end)
          .on('click', $.proxy(function () {
            if (this.current === pageTotal) return;
            this.change(pageTotal);
          }, this))
          .appendTo(this.$this);
        if (this.options.showElevator) {
          this.$elevator = $('<select>')
            .on('change', $.proxy(function () {
              this.change(parseInt(this.$elevator[0].value, 10));
            }, this))
            .appendTo(this.$this);
          for (var o = 0; o < pageTotal; o++) {
            var _page = o + 1;
            var options = {
              val: _page,
            };
            if (_page === this.current) {
              options['selected'] = 'selected';
            }
            $('<option>').attr(options)
              .text(_page)
              .appendTo(this.$elevator);
          }
        }
      }
      if (!isLite && this.options.showTotal) {
        this.$count = $('<span>')
          .text(lang.total.replace(/(%\w+%)/g, function (word) {
            if (word.indexOf('pageTotal') !== -1) return pageTotal;
            if (word.indexOf('total') !== -1) return total;
          }))
          .appendTo(this.$this);
      }
      this.go(this.options.current);
    },
    pages: function (current) {
      if (this.options.mode === 'lite') return;
      var lang = this.options.lang;
      var span = this.options.span;
      var pageTotal = this.pageTotal;
      var start = 0;
      var end = 0;
      start = (current < span) ? 0 : current - Math.ceil(span / 2);
      end = Math.min(start + span, pageTotal);
      this.$pages = this.$pages || $('<div class="pages">');
      this.$pages.empty();
      for (start; start < end; start++) {
        var page = (start + 1);
        $('<a>').toggleClass('current', current === page)
          .attr({
            href: 'javascript: void(0);',
            title: lang.hover.replace('%page%', page),
            'data-value': page,
          })
          .text(page)
          .on('click', $.proxy(function (e) {
            var $page = $(e.currentTarget);
            if ($page.hasClass('current')) return;
            this.change(page);
          }, this))
          .appendTo(this.$pages);
      }
      return this.$pages;
    },
    change: function (page) {
      var isLite = this.options.mode === 'lite';
      var pageTotal = this.pageTotal;
      this.current = page;
      this.$first.toggleClass('disabled', page <= 1);
      this.$prev.toggleClass('disabled', page <= 1);
      this.$next.toggleClass('disabled', page >= pageTotal);
      this.$end.toggleClass('disabled', page >= pageTotal);
      if (!isLite) {
        this.$ellipsisPrev.toggle(this.ellipsis && page > this.ellipsisSumPrev);
        this.$ellipsisNext.toggle(this.ellipsis && page < this.ellipsisSumNext);
      }
      this.pages(page);
      if (this.options.showElevator) {
        this.$elevator[0].value = page;
      }
      this.options.onChange(page, this.options, this);
    },
    go: function (page) {
      page = parseInt(page, 10);
      page = Math.max(0, page);
      page = Math.min(page, this.pageTotal);
      this.change(page);
    },
    destroy: function () {
      $.removeData(this.$this[0], Pager['NAME']);
      this.$this.empty();
    },
  };
  Pager.NAME = 'pager';
  Pager.DEFAULTS = {
    current: 1, 
    total: 0, 
    size: 10, 
    span: 5, 
    mode: 'default', 
    lang: {
      first: '首页',
      prev: '上一页',
      next: '下一页',
      end: '最后一页',
      hover: '第 %page% 页',
      total: '共 %pageTotal% 页 / %total% 条',
      pump: '转到第 %d% 页',
      ellipsisPrev: '前 %d% 页',
      ellipsisNext: '后 %d% 页',
    },
    showTotal: true, 
    showElevator: true, 
    onChange: $.noop, 
  };
  $.fn.pager = function (options) {
    var isMethod = typeof options === 'string';
    var agrs = Array.prototype.slice.call(arguments, 1);
    return this.each(function () {
      var $this = $(this),
        data = $.data(this, Pager['NAME']);
      if (!data) {
        data = $.data(this, Pager['NAME'], new Pager(this, isMethod ? {} : options));
      }
      if (isMethod) {
        data[options].apply(data, agrs);
      }
    });
  };
})(jQuery);
