Vue.component('app', {
  template: `
  <section>
    <md-toolbar class="md-primary">
      <h3 class="md-title">NEEO - Driver Manager</h3>
    </md-toolbar>
    <router-view></router-view>
  </section>`
  ,
});

var Home = Vue.component('home', {
  template: '<h1>Home</h1>'
});

var Drivers = Vue.component('drivers', {
  template: `
  <section>
    <md-card>
     <md-card-content>
      <md-autocomplete v-model="selectedPackage" :md-options="searchItems" @md-changed="search"
        :md-open-on-focus="false" style="width: 40%; margin: 0 auto;">
        <label>Search For Drivers</label>

        <template slot="md-autocomplete-item" slot-scope="{ item }">
          <span @click="addDriver(item)">{{ item.name }}</span>
        </template>
      </template>
      </md-autocomplete>
     </md-card-content>
   </md-card>

    <md-card v-for="driver in drivers">
     <md-card-header>
       <div class="md-title">{{driver.name}}</div>
     </md-card-header>

     <md-card-content>
      {{driver.pm2_env.status}} ({{driver.monit.cpu}}% {{driver.monit.memory}})
     </md-card-content>

     <md-card-actions>
       <md-button v-on:click="stop(driver.name)">Stop</md-button>
       <md-button v-on:click="start(driver.name)">Start</md-button>
       <md-button v-on:click="del(driver.name)">Delete</md-button>
     </md-card-actions>
   </md-card>
  </section>`,
  data: function () {
    return {
      newPkgName: '',
      selectedPackage: null,
      drivers: [],
      searchItems: []
    }
  },
  beforeRouteEnter: function (to, from, next) {
    axios.get('http://localhost:3001/drivers').then(function (response) {
      next(function(vm) { vm.setData(response.data) });
    });
  },
  methods: {
    addDriver: function (pkg) {
      var me = this;

      this.selectedPackage = null;

      axios.post('http://localhost:3001/drivers', {name: pkg.name}).then(function () {
        return me.getDrivers();
      }).then(function (drivers) {
        me.setData(drivers);
      });
    },

    search: function (query) {
      var me = this;

      this.searchItems = axios.get('http://localhost:3001/drivers/' + query).then(function (response) {
        return response.data;
      });
    },

    stop: function (name) {
      var me = this;

      axios.put('http://localhost:3001/drivers', {
        name: name,
        action: 'stop'
      }).then(function (response) {
        return me.getDrivers();
      }).then(function (drivers) {
        me.setData(drivers);
      });
    },

    start: function (name) {
      var me = this;

      axios.put('http://localhost:3001/drivers', {
        name: name,
        action: 'start'
      }).then(function (response) {
        return me.getDrivers();
      }).then(function (drivers) {
        me.setData(drivers);
      });
    },

    add: function (name) {
      var me = this;

      axios.post('http://localhost:3001/drivers', {
        name: name
      }).then(function (response) {
        return me.getDrivers();
      }).then(function (drivers) {
        me.setData(drivers);
      });
    },

    del: function (name) {
      var me = this;

      axios.delete('http://localhost:3001/drivers/', {
        params: {
          name: name
        }
      }).then(function (response) {
        return me.getDrivers();
      }).then(function (drivers) {
        me.setData(drivers);
      });
    },

    getDrivers() {
      return axios.get('http://localhost:3001/drivers').then(function (response) {
        return response.data;
      });
    },

    setData: function (drivers) {
      this.drivers = drivers;
    }
  }
});

var router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', component: Drivers }
  ]
});

Vue.use(VueMaterial.default)

var vue = new Vue({
  router: router,
  el: '#app',
  template: '<app/>'
});
