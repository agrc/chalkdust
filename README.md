Chalkdust
=========

A red line viewer for the [agrc/ijit/notify/ChangeRequest](https://github.com/agrc/agrc.ijit/blob/master/widgets/notify/ChangeRequest.js) widget.

Pass the [viewer](http://mapserv.utah.gov/chalkdust) a query string and it will zoom and display it.


### Web mercator requests
```js
?center={"x":-12448472,"y":4969582,"spatialReference":{"wkid":3857}}
&level=12
&redline={"x":-12448472,"y":4969582,"spatialReference":{"wkid":3857}}
```

### UTM Zone 12 North NAD 83 requests
```js
?center={"x":429622.47822559363,"y":4326436.184249276,"spatialReference":{"wkid":26912}}
&level=12
&redline={"x":429191.325612959,"y":4326454.696342062,"spatialReference":{"wkid":26912}}
```
