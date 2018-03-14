
export class chordMatrix {
  constructor(){
    this._matrix = [];
    this.dataStore = [];
    this.matrixIndex = [];
    this.indexHash = {};
    this.chordLayout;
    this.layoutCache;
    this.matrix = this.Initialize();
  }

  chordID = (d) => {

    let s = this.matrixIndex[d.source.index];
    let t = this.matrixIndex[d.target.index];
    return (s < t) ? s + "__" + t: t + "__" + s;

  };

  Initialize = () => {
    let matrix = {
      update : () =>  {
        let _this = this;
        this._matrix = [];
        let objs = [];
        let entry = {};

        this.layoutCache = {groups: {}, chords: {}};
        this.matrix.groups().forEach(function (group) {
          _this.layoutCache.groups[group._id] = {
            startAngle: group.startAngle,
            endAngle: group.endAngle
          };
        });

        this.matrix.chords().forEach(function (chord) {

          _this.layoutCache.chords[_this.chordID(chord)] = {
            source: {
              _id: chord.source._id,
              startAngle: chord.source.startAngle,
              endAngle: chord.source.endAngle
            },
            target: {
              _id: chord.target._id,
              startAngle: chord.target.startAngle,
              endAngle: chord.target.endAngle
            }
          };
        });
        this.matrixIndex = Object.keys(this.indexHash);

        for (let i = 0; i < this.matrixIndex.length; i++) {
          if (!this._matrix[i]) {
            this._matrix[i] = [];
          }
          for (let j = 0; j < this.matrixIndex.length; j++) {
            objs = this.dataStore.filter(function (obj) {
              return _this.filter(obj, _this.indexHash[_this.matrixIndex[i]], _this.indexHash[_this.matrixIndex[j]]);
            });
            entry = this.reduce(objs, this.indexHash[this.matrixIndex[i]], this.indexHash[this.matrixIndex[j]]);
            entry.valueOf = function () { return +this.value };
            this._matrix[i][j] = entry;
          }
        }
        this.chordLayout.matrix(this._matrix);
        return this._matrix;
      },

    data : (data) => {
      this.dataStore = data;
      return this.matrix;
    },

    filter : (func) => {
      this.filter = func;
      return this.matrix;
    },

    reduce : (func) => {
      this.reduce = func;
      return this.matrix;
    },

    layout : (d3_chordLayout) => {
      this.chordLayout = d3_chordLayout;
      return this.matrix;
    },

    groups : () => {
        let _this = this;
      return this.chordLayout.groups().map(function (group) {
        group._id = _this.matrixIndex[group.index];
        return group;
      });
    },

    chords : () => {
        let _this = this;
      return this.chordLayout.chords().map(function (chord) {
        chord._id = _this.chordID(chord);
        chord.source._id = _this.matrixIndex[chord.source.index];
        chord.target._id = _this.matrixIndex[chord.target.index];
        return chord;
      });
    },

    addKey : (key, data) => {
      if (!this.indexHash[key]) {
        this.indexHash[key] = {name: key, data: data || {}};
      }
    },

    addKeys : (props, fun) => {
      for (let i = 0; i < this.dataStore.length; i++) {
        for (let j = 0; j < props.length; j++) {
          this.matrix.addKey(this.dataStore[i][props[j]], fun ? fun(this.dataStore[i], props[j]):{});
        }
      }
      return this.matrix;
    },

    resetKeys : () => {
      this.indexHash = {};
      return this.matrix;
    },
    groupTween : (d3_arc) => {
        let _this = this;
      return function (d, i) {
        let tween;
        let cached = _this.layoutCache.groups[d._id];

        if (cached) {
          tween = d3.interpolateObject(cached, d);
        } else {
          tween = d3.interpolateObject({
            startAngle:d.startAngle,
            endAngle:d.startAngle
          }, d);
        }

        return function (t) {
          return d3_arc(tween(t));
        };
      };
    },

    chordTween : (d3_path) => {
        let _this = this;
      return function (d, i) {
        let tween, groups;
        let cached = _this.layoutCache.chords[d._id];

        if (cached) {
          if (d.source._id !== cached.source._id){
            cached = {source: cached.target, target: cached.source};
          }
          tween = d3.interpolateObject(cached, d);
        } else {
          if (_this.layoutCache.groups) {
            groups = [];
            for (let key in _this.layoutCache.groups) {
              cached = _this.layoutCache.groups[key];
              if (cached._id === d.source._id || cached._id === d.target._id) {
                groups.push(cached);
              }
            }
            if (groups.length > 0) {
              cached = {source: groups[0], target: groups[1] || groups[0]};
              if (d.source._id !== cached.source._id) {
                cached = {source: cached.target, target: cached.source};
              }
            } else {
              cached = d;
            }
          } else {
            cached = d;
          }

          tween = d3.interpolateObject({
            source: {
              startAngle: cached.source.startAngle,
              endAngle: cached.source.startAngle
            },
            target: {
              startAngle: cached.target.startAngle,
              endAngle: cached.target.startAngle
            }
          }, d);
        }

        return function (t) {
          return d3_path(tween(t));
        };
      };
    },

    read : (d) => {
      let g, m = {};

      if (d.source) {
        m.tname  = d.source._id;
        m.tid  = d.source.value.data[0].taxId;
        m.tvalue = +d.source.value;
        m.kname  = d.target._id;
        m.kid  = d.target.value.data[0].keywordId;
        m.kvalue = +d.target.value;
      } else {
        g = this.indexHash[d._id];
        m.gname  = g.name;
        m.gdata  = g.data;
        m.gvalue = d.value;
      }
      return m;
    }
    }
    return matrix;
  }
}