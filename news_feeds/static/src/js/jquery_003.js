(function(l) {
    l.fn.rssfeed = function(b, h, w) {
        h = l.extend({
            limit: 10,
            offset: 1,
            header: !0,
            titletag: "h4",
            date: !0,
            dateformat: "datetime",
            content: !0,
            snippet: !0,
            media: !0,
            showerror: !0,
            errormsg: "",
            key: null,
            ssl: !1,
            linktarget: "_self",
            linkredirect: "",
            linkcontent: !1,
            sort: "",
            sortasc: !0,
            historical: !1
        }, h);
        //return this.each(function(z, q) {
        z=0;
        q='<div class="rssHeader"><a target="_self" href="" title=""></a></div><div style="overflow: hidden; position: relative; " class="rssBody"></div>';
            var u = l(q),
                f = "";
            h.ssl && (f = "s");
            u.hasClass("rssFeed") || u.addClass("rssFeed");
            if (null == b) return !1;
            0 < h.offset && (h.offset -= 1);
            h.limit += h.offset;
            f = "http" + f + "://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" +
                encodeURIComponent(b);
            f += "&num=" + h.limit;
            h.historical && (f += "&scoring=h");
            null != h.key && (f += "&key=" + h.key);alert(f);
            l.getJSON(f + "&output=json_xml", function(b) {
                if (200 == b.responseStatus) {
                    var f = b.responseData,
                        e = h;
                    if (b = f.feed) {
                        var j = [],
                            d = 0,
                            m = "",
                            v = "odd";
                        if (e.media) {
                            var n = f.xmlString;
                            "Microsoft Internet Explorer" == navigator.appName ? (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(n)) : d = (new DOMParser).parseFromString(n, "text/xml");
                            n = d.getElementsByTagName("item")
                        }
                        e.header && (m += '<div class="rssHeader"><a href="' +
                            b.link + '" title="' + b.description + '">' + b.title + "</a></div>");
                        m += '<div class="rssBody"><ul>';
                        for (f = e.offset; f < b.entries.length; f++) {
                            d = f - e.offset;
                            j[d] = [];
                            var g = b.entries[f],
                                a, c = "",
                                k = g.link;
                            switch (e.sort) {
                                case "title":
                                    c = g.title;
                                    break;
                                case "date":
                                    c = g.publishedDate
                            }
                            j[d].sort = c;
                            if (g.publishedDate) switch (c = new Date(g.publishedDate), a = c.toLocaleDateString() + " " + c.toLocaleTimeString(), e.dateformat) {
                                case "datetime":
                                    break;
                                case "date":
                                    a = c.toLocaleDateString();
                                    break;
                                case "time":
                                    a = c.toLocaleTimeString();
                                    break;
                                case "timeline":
                                    a =
                                        new Date(c);
                                    a = Math.round(((new Date).getTime() - a.getTime()) / 1E3);
                                    60 > a ? a = "< 1 min" : (3600 > a ? (a = Math.round(a / 60) - 1, c = "min") : 86400 > a ? (a = Math.round(a / 3600) - 1, c = "hour") : 604800 > a ? (a = Math.round(a / 86400) - 1, c = "day") : (a = Math.round(a / 604800) - 1, c = "week"), 1 < a && (c += "s"), a = a + " " + c);
                                    break;
                                default:
                                    a = c, c = new Date(a), a = e.dateformat, a = a.replace("dd", p(c.getDate())), a = a.replace("MMMM", x(c.getMonth())), a = a.replace("MM", p(c.getMonth() + 1)), a = a.replace("yyyy", c.getFullYear()), a = a.replace("hh", p(c.getHours())), a = a.replace("mm",
                                        p(c.getMinutes())), a = a.replace("ss", p(c.getSeconds()))
                            }
                            e.linkredirect && (k = encodeURIComponent(k));
                            j[d].html = "<" + e.titletag + '><a href="' + e.linkredirect + k + '" title="View this feed at ' + b.title + '">' + g.title + "</a></" + e.titletag + ">";
                            e.date && a && (j[d].html += "<div>" + a + "</div>");
                            e.content && (g = e.snippet && "" != g.contentSnippet ? g.contentSnippet : g.content, e.linkcontent && (g = '<a href="' + e.linkredirect + k + '" title="View this feed at ' + b.title + '">' + g + "</a>"), j[d].html += "<p>" + g + "</p>");
                            if (e.media && 0 < n.length && (k = n[f].getElementsByTagName("enclosure"),
                                    0 < k.length)) {
                                j[d].html += '<div class="rssMedia"><div>Media files</div><ul>';
                                for (g = 0; g < k.length; g++) {
                                    var r = k[g].getAttribute("url"),
                                        s = k[g].getAttribute("type"),
                                        t = k[g].getAttribute("length"),
                                        c = j[d],
                                        y = j[d].html,
                                        r = '<li><a href="' + r + '" title="Download this media">' + r.split("/").pop() + "</a> (" + s + ", ",
                                        s = Math.floor(Math.log(t) / Math.log(1024)),
                                        t = (t / Math.pow(1024, Math.floor(s))).toFixed(2) + " " + "bytes kb MB GB TB PB".split(" ")[s];
                                    c.html = y + (r + t + ")</li>")
                                }
                                j[d].html += "</ul></div>"
                            }
                        }
                        e.sort && j.sort(function(a, c) {
                            if (e.sortasc) var b =
                                a.sort,
                                d = c.sort;
                            else b = c.sort, d = a.sort;
                            if ("date" == e.sort) return new Date(b) - new Date(d);
                            b = b.toLowerCase();
                            d = d.toLowerCase();
                            return b < d ? -1 : b > d ? 1 : 0
                        });
                        l.each(j, function(a) {
                            m += '<li class="rssRow ' + v + '">' + j[a].html + "</li>";
                            v = "odd" == v ? "even" : "odd"
                        });
                        m += "</ul></div>";
                        l(q).html(m);
                        l("a", q).attr("target", e.linktarget)
                    }
                    l.isFunction(w) && w.call(this, u)
                } else h.showerror && (d = "" != h.errormsg ? h.errormsg : b.responseDetails), l(q).html('<div class="rssError"><p>' + d + "</p></div>")
           // })
        })
        return h;
    };
    var p = function(b) {
            b += "";
            2 > b.length &&
                (b = "0" + b);
            return b
        },
        x = function(b) {
            return "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[b]
        }
})(jQuery);
