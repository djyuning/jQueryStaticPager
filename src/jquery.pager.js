(function () {
  'use strict';

  // 分页组件
  var Pager;

  Pager = function (el, options) {
    this.$this = $(el);

    // 参数合并
    this.options = $.extend(true, {}, Pager['DEFAULTS'], options);

    // 初始化
    this.init();

  };

  Pager.prototype = {

    // 初始化
    init: function () {
      // 当前页
      this.current = this.options.current || 1;
      // 总页数
      this.pageTotal = Math.ceil(this.options.total / this.options.size);

      // 样式
      this.isLite = this.options.mode.toLowerCase() === 'lite';
      this.isSimple = this.options.mode.toLowerCase() === 'simple';

      // 是否可以显示 前 N 页 和 下 N 页
      this.ellipsis = this.pageTotal > this.options.span;
      this.ellipsisSumPrev = this.options.span; // 当前页码大于该阈值时，可显示 【前 N 页】 按钮
      this.ellipsisSumNext = this.pageTotal - this.options.span; // 当前页码小于该阈值时，可显示 【后 N 页】 按钮

      // 初始化
      this.create();

      // 使用左右键切换页码
      this.keyboard();
    },

    // 创建分页
    create: function () {
      var span = this.options.span;
      var lang = this.options.lang;
      var total = this.options.total;
      var pageTotal = this.pageTotal;

      // 清空结构
      this.$this.empty();

      if (pageTotal > 1) {

        // 首页
        this.$first = $('<a>')
          .text(this.isSimple ? '<<' : lang.first)
          .attr({
            href: 'javascript: void(0);',
            title: lang.pump.replace('%d%', 1),
          })
          .toggleClass('adorn', this.isSimple)
          .toggleClass('disabled', this.current <= 1)
          .on('click', $.proxy(function () {
            if (this.current === 1) return;
            this.change(1);
          }, this))
          .appendTo(this.$this);

        // 上一页
        this.$prev = $('<a>')
          .text(this.isSimple ? '<' : lang.prev)
          .attr({
            href: 'javascript: void(0);',
            title: lang.prev,
          })
          .toggleClass('adorn', this.isSimple)
          .toggleClass('disabled', this.current <= 1)
          .on('click', $.proxy(function () {
            if (this.current === 1) return;
            this.change(this.current - 1);
          }, this))
          .appendTo(this.$this);

        // 快速翻页
        if (!this.isLite) {
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

        // 创建页码
        this.$this.append(this.pages(this.current));

        // 快速翻页
        if (!this.isLite) {
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

        // 下一页
        this.$next = $('<a>')
          .attr({
            href: 'javascript: void(0);',
            title: lang.next,
          })
          .toggleClass('adorn', this.isSimple)
          .toggleClass('disabled', this.current >= pageTotal)
          .text(this.isSimple ? '>' : lang.next)
          .on('click', $.proxy(function () {
            if (this.current === pageTotal) return;
            this.change(this.current += 1);
          }, this))
          .appendTo(this.$this);

        // 最后一页
        this.$end = $('<a>')
          .attr({
            href: 'javascript: void(0);',
            title: lang.end,
          })
          .toggleClass('adorn', this.isSimple)
          .toggleClass('disabled', this.current >= pageTotal)
          .text(this.isSimple ? '>>' : lang.end)
          .on('click', $.proxy(function () {
            if (this.current === pageTotal) return;
            this.change(pageTotal);
          }, this))
          .appendTo(this.$this);

        // 电梯
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

      // 统计
      if (!this.isLite && this.options.showTotal) {
        this.$count = $('<span>')
          .text(lang.total.replace(/(%\w+%)/g, function (word) {
            if (word.indexOf('pageTotal') !== -1) return pageTotal;
            if (word.indexOf('total') !== -1) return total;
          }))
          .appendTo(this.$this);
      }

      // 回调
      this.onCreated(this);

      // 切换到初始页码
      this.go(this.options.current);
    },

    // 创建页码
    pages: function (current) {
      // 精简版不显示页码
      if (this.options.mode === 'lite') return;

      var lang = this.options.lang;
      var span = this.options.span;
      var pageTotal = this.pageTotal;
      var start = 0;
      var end = 0;

      // 起点 和 终点
      // 如果当前页码小于每次课显示最大页数，则使用 0 开始，否则，分页居中显示
      start = (current < span) ? 0 : current - Math.ceil(span / 2);
      end = Math.min(start + span, pageTotal);

      // 分页组
      this.$pages = this.$pages || $('<div class="pages">');

      // 清空现有结构
      this.$pages.empty();

      // 创建页码
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
            this.change($page.data('value'));
          }, this))
          .appendTo(this.$pages);

      }

      return this.$pages;

    },

    // 使用左右键切换页码
    keyboard: function () {
      if (!this.options.keyboard) return;

      $(document).on('keyup.' + Pager.NAME, $.proxy(function (e) {
        if (this.pageTotal > 1) {

          // 上一页
          if (e.which === 37) {
            this.change(Math.max(1, this.current - 1));
            e.preventDefault();
            e.stopPropagation();
          }

          // 下一页
          if (e.which === 39) {
            this.change(Math.min(this.pageTotal, this.current + 1));
            e.preventDefault();
            e.stopPropagation();
          }

        }
      }, this));

    },

    // 分页发生变化
    change: function (page) {
      var pageTotal = this.pageTotal;

      // 更新到分页
      this.current = page;

      // 常规元素是否可见
      this.$first.toggleClass('disabled', page <= 1);
      this.$prev.toggleClass('disabled', page <= 1);
      this.$next.toggleClass('disabled', page >= pageTotal);
      this.$end.toggleClass('disabled', page >= pageTotal);

      if (!this.isLite) {
        this.$ellipsisPrev.toggle(this.ellipsis && page > this.ellipsisSumPrev);
        this.$ellipsisNext.toggle(this.ellipsis && page < this.ellipsisSumNext);
      }

      // 更新分页
      this.pages(page);

      // 更新电梯
      if (this.options.showElevator) {
        this.$elevator[0].value = page;
      }

      // 回调
      this.options.onChange(page, this.options, this);
    },

    // 跳转到指定页码
    go: function (page) {
      page = parseInt(page, 10);
      page = Math.max(0, page);
      page = Math.min(page, this.pageTotal);
      this.change(page);
    },

    // 销毁
    destroy: function () {
      // 移除数据
      $.removeData(this.$this[0], Pager['NAME']);
      // 清空已添加的结构
      this.$this.empty();
    },

  };

  Pager.NAME = 'pager';

  // 配置参数
  Pager.DEFAULTS = {
    current: 1, // {number} 当前页
    total: 0, // {number} 数据总数
    size: 10, // {number} 每页显示条数
    span: 5, // 每次显示页数
    mode: 'default', // {string} 模式，default 完整 | simple 简约 | lite 极简
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
    keyboard: true, // 使用左右键切换页码
    showTotal: true, // 显示总数
    showElevator: true, // 显示快速直达
    onCreated: $.noop, // 初始化完成时执行的回调
    onChange: $.noop, // 分页发生变化时执行的回调
  };

  // 插件调用
  $.fn.pager = function (options) {
    var isMethod = typeof options === 'string';
    var agrs = Array.prototype.slice.call(arguments, 1);

    return this.each(function () {
      var data = $.data(this, Pager['NAME']);

      // 初始化
      if (!data) {
        data = $.data(this, Pager['NAME'], new Pager(this, isMethod ? {} : options));
      }

      // 调用方法
      if (isMethod) {
        data[options].apply(data, agrs);
      }

    });
  };

})(jQuery);
