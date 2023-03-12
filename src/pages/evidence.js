import { Table } from "antd";
import React from "react";
import config from "../config";
import axios from "axios";
const formatResponse = (data) => {
  let res = [];
  if (!data || data.length <= 0) return null;
  for (let i = 0; i < data.length; i++) {
    res.push({
      pmid: data[i].pmid ,
      title: data[i].title,
      ann_num: data[i].annotations ? data[i].annotations.length : 0,
      raw_rel_num: data[i].raw_relations ? data[i].raw_relations.length : 0,
      agg_rel_num: data[i].agg_relations ? data[i].agg_relations.length : 0,
    });
  }

  return res;
};
class Evidence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      items: [],
    };
  }
  componentDidMount() {
    axios
      .get(`${config.host}/evidence?limit=${config.pageSize}&from=0`)
      .then((res) => {
        console.log(res.data.evidences);
        this.setState({
          total: res.data.total_hits,
          items: formatResponse(res.data.evidences),
        });
      });
  }

  columns = [
    {
      title: "PMID",
      dataIndex: "pmid",
      key: "pmid",
      sorter: (a, b) => (a.pmid < b.pmid ? -1 : 1),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title < b.title ? -1 : 1),
    },
    {
      title: "No. Entity",
      dataIndex: "ann_num",
      key: "ann_num",
      sorter: (a, b) => (a.ann_num < b.ann_num ? -1 : 1),
    },
    {
      title: "No. Raw Relation",
      dataIndex: "raw_rel_num",
      key: "raw_rel_num",
      sorter: (a, b) => (a.raw_rel_num < b.raw_rel_num ? -1 : 1),
    },
    {
      title: "No. Extracted Relation",
      dataIndex: "agg_rel_num",
      key: "agg_rel_num",
      sorter: (a, b) => (a.agg_rel_num < b.agg_rel_num ? -1 : 1),
    },
  ];

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "Center",
            alignItems: "Center",
            // height: "100vh",
          }}
        >
          <h1>List Extracted Evidences</h1>
        </div>
        <div>
          <Table
            dataSource={this.state.items}
            columns={this.columns}
            pagination={{
              defaultPageSize: config.pageSize,
              total: 2000,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30"],
              onChange: (page, pageSize) => {
                axios
                  .get(
                    `${config.host}/evidence?limit=${pageSize}&from=${
                      (page - 1) * pageSize
                    }`
                  )
                  .then((res) => {
                    this.setState({
                      total: res.data.total_hits,
                      items: formatResponse(res.data.evidences),
                    });
                  });
              },
              onShowSizeChange: (current, size) => {
                axios
                  .get(
                    `${config.host}/evidence?limit=${size}&from=${
                      (current - 1) * size
                    }`
                  )
                  .then((res) => {
                    this.setState({
                      total: res.data.total_hits,
                      items: formatResponse(res.data.evidences),
                    });
                  });
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default Evidence;
