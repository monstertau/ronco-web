import { Table, Tag } from "antd";
import axios from "axios";
import React from "react";
import config from "../config";

const formatResponse = (data) => {
  let res = [];
  if (!data || data.length <= 0) return null;
  for (let i = 0; i < data.length; i++) {
    res.push({
      disease: data[i].disease.name ? data[i].disease.name : "",
      gene: data[i].gene ? data[i].gene.name : "",
      variant: data[i].variant ? data[i].variant.name : "",
      drug: data[i].drug ? data[i].drug.id : "",
      relation: data[i].relation_type ? data[i].relation_type : "",
      doc_num: data[i].pmids ? data[i].pmids.length : 0,
    });
  }

  return res;
};

class Drug extends React.Component {
  // fetchData()
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      items: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${config.host}/drug?limit=${config.pageSize}&from=0`)
      .then((res) => {
        this.setState({
          total: res.total_hits,
          items: formatResponse(res.data.Drugs),
        });
      });
  }

  columns = [
    {
      title: "Disease name",
      dataIndex: "disease",
      key: "disease",
      sorter: (a, b) => (a.disease < b.disease ? -1 : 1),
      render: (text) =>
        text ? (
          <Tag color="pink" key={text}>
            {text.toUpperCase()}
          </Tag>
        ) : (
          ""
        ),
    },
    {
      title: "Gene name",
      dataIndex: "gene",
      key: "gene",
      sorter: (a, b) => (a.gene < b.gene ? -1 : 1),
      render: (text) =>
        text ? (
          <Tag color="blue" key={text}>
            {text}
          </Tag>
        ) : (
          ""
        ),
    },
    {
      title: "Variant name",
      dataIndex: "variant",
      key: "variant",
      sorter: (a, b) => (a.variant < b.variant ? -1 : 1),
      render: (tags) =>
        tags ? (
          <>
            {tags.map((tag) => {
              return (
                <Tag color="red" key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ) : (
          ""
        ),
    },
    {
      title: "Drug name",
      dataIndex: "drug",
      key: "drug",
      sorter: (a, b) => (a.drug < b.drug ? -1 : 1),
      render: (text) =>
        text ? (
          <Tag color="green" key={text}>
            {text}
          </Tag>
        ) : (
          ""
        ),
    },
    {
      title: "Relation",
      dataIndex: "relation",
      key: "relation",
      sorter: (a, b) => (a.relation < b.relation ? -1 : 1),
    },
    {
      title: "No. document",
      dataIndex: "doc_num",
      key: "doc_num",
      sorter: (a, b) => a.doc_num - b.doc_num,
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
          <h1>List Extracted Drugs</h1>
        </div>
        <div>
          <Table
            dataSource={this.state.items}
            columns={this.columns}
            pagination={{
              defaultPageSize: config.pageSize,
              total: 2000,
              showSizeChanger: true,
              pageSizeOptions: ["50", "100", "500"],
              onChange: (page, pageSize) => {
                axios
                  .get(
                    `${config.host}/drug?limit=${pageSize}&from=${
                      (page - 1) * pageSize
                    }`
                  )
                  .then((res) => {
                    this.setState({
                      total: res.data.total_hits,
                      items: formatResponse(res.data.Drugs),
                    });
                  });
              },
              onShowSizeChange: (current, size) => {
                axios
                  .get(
                    `${config.host}/drug?limit=${size}&from=${
                      (current - 1) * size
                    }`
                  )
                  .then((res) => {
                    this.setState({
                      total: res.data.total_hits,
                      items: formatResponse(res.data.Drugs),
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

export default Drug;
