<template>
  <div class="myevent-box">
    <table class="table">
      <thead>
        <tr>
          <th class="col-md-1">发布ID</th>
          <th class="col-md-2">设置时间</th>
          <th class="col-md-2">任务描述</th>
          <th class="col-md-4">发布人</th>
          <th class="col-md-4">状&nbsp;态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in getData" :key="index">
          <td class="col-md-1">
            {{ item.id}}
          </td>
          <td class="col-md-2">
            {{ item.time}}
          </td>
          <td class="col-md-2">{{ item.description }}</td>
          <td class="col-md-4">{{ item.publishman}}</td>
          <td class="col-md-4">{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  },
  data() {
    return {
      getData: {}
    };
  },
  methods: {
    
  },
  watch: {
    data(data) {
      if (data) {
        this.getData = data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.myevent-box {
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow: hidden;
  margin-top: -10px;
  .table {
    table-layout: fixed;
    .col-md-1{
          width: 80px;
        }
    .col-md-2{
          width: 290px;
        }
    .col-md-4{
      width: 100px;
    }
    tr {
      border: none;
      th {
        font-size: 1.1rem;
        text-align: center;
        background: #053a98;
        color: #fffdef;
        border: 1px solid#0086B3;
        

      }
      td {
        font-size: 1rem;
        text-align: center;
        border: 1px solid#0086B3;
        color: #19d4ae;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:nth-child(odd) {
        td {
          color: #5ab1ef;
        }
      }
    }
  }
}
</style>
