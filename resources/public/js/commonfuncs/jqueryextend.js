/**
 * Created by jack on 14/10/31.
 */

(function($){ $.extend({ repeat: function(str, i) { if (isNaN(i) || i == 0) return ""; return str + $.repeat(str, i-1); } }) })(jQuery)
