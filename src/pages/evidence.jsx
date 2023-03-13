import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
// import Highlighter from 'react-hightlight-colors'
import config from "../config";


const formatResponse = (data) => {
  let res = [];
  if (!data || data.length <= 0) return null;
  for (let i = 0; i < data.length; i++) {
    res.push({
      id: data[i]?.id,
      pmid: data[i].pmid,
      title: data[i].title,
      ann_num: data[i].annotations ? data[i].annotations.length : 0,
      raw_rel_num: data[i].raw_relations ? data[i].raw_relations.length : 0,
      agg_rel_num: data[i].agg_relations ? data[i].agg_relations.length : 0,
    });
  }

  return res;
};


function Evidence() {

  const [total, setTotal] = useState(0)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false);
  const [viewDetailsId, setViewDetailsId] = useState(null);
  const [myPost, setMyPost] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [group, setGroup] = useState([])
  const [fullArrText, setFullArrText] = useState([])

  const getDataEvidence = async () => {

    try {
      setLoading(true)

      const { data } = await axios.get(`${config.host}/evidence?limit=${config.pageSize}&from=0`)
      const { total_hits, evidences } = data
      const formatDataEvidences = await formatResponse(evidences)

      setLoading(false)
      setTotal(total_hits)
      setItems(formatDataEvidences)

    } catch (error) {
      setLoading(false)
      console.log(error)
    }

  }

  useEffect(() => {
    getDataEvidence()
  }, [])

  const transformArray = (arr = []) => {
    const res = [];
    let dataFullText = []
    const map = {};
    let i, j, curr;
    for (i = 0, j = arr.length; i < j; i++) {
      curr = arr[i];
      if (!(curr.ann_type in map)) {
        map[curr.ann_type] = { ann_type: curr.ann_type, textsInType: [] };
        res.push(map[curr.ann_type]);
      };
      map[curr.ann_type].textsInType.push(curr.text);
    };

    for (let index = 0; index < res.length; index++) {
      const element = res[index]?.textsInType;
      dataFullText.push(element)
    }
    return { res, dataFullText: [...new Set(dataFullText.flat())] }
  };

  const handleView = async (id) => {
    try {
      if (id) {
        const { data } = await axios.get(`${config.host}/evidence/${id}`)
        console.log("datadatadata", data)
        const dataText = `${data?.abstract}`
        const { res, dataFullText } = transformArray(data?.annotations)

        setGroup(res)
        setFullArrText(dataFullText)
        setMyPost(dataText)
        setViewDetailsId(data.pmid);
        setVisible(true);
        setSelectedData(data)
      }
    } catch (e) {
      console.log(e);
      //
    }

  }

  const onReset = () => {
    setViewDetailsId(null);
    setSelectedData(null)
  };

  const columns = [
    {
      title: "Num Order",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1
    },
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

    {
      title: "Actions",
      width: 100,
      fixed: "right",
      dataIndex: "id",
      key: "id",
      render: (id, row) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleView(id)}
            type="link"
          />

        </Space>
      ),
    },
  ];
  const columns2 = [
    {
      title: "Num Order",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1
    },
    {
      title: "First Annotation",

      render: (id, row) => row?.first_ann?.text,

    },
    {
      title: "Second Annotation",
      render: (id, row) => row?.second_ann?.text,

    },
    {
      title: "First Annotation Type",
      render: (id, row) => row?.first_ann?.ann_type,

    },
    {
      title: "Second Annotation Type",
      render: (id, row) => row?.second_ann?.ann_type,

    },
    {
      title: "Relation Type",
      dataIndex: "relation_type",
      key: "relation_type",

    },

  ];

  const highlightText = (text, textToMatch) => {
    const matchRegex = RegExp(textToMatch.join("|"), "ig");
    const matches = [...text.matchAll(matchRegex)];
    // this consist of the color array 
    const color = ["cyan", "pink", "yellow", "blue", "black"];
    // const group
    return text.split(matchRegex).map((nonBoldText, index, arr) => {
      const labelMatches = matches[index] && matches[index][0]
      const labelInGroup = group?.find((g) => g?.textsInType?.includes(labelMatches))?.ann_type
      const indexColor = group.findIndex(x => x.ann_type === labelInGroup);
      return (
        <span key={index}>
          {nonBoldText}{index + 1 !== arr.length && (
            <mark
              style={{
                // and this match the color index and textMatchIndex
                backgroundColor:
                  color[
                  indexColor
                  ]
              }}
            >
              {matches[index]}
            </mark>
          )}
        </span>

      )
    });
  };

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
          loading={loading}
          dataSource={items}
          columns={columns}
          pagination={{
            defaultPageSize: config.pageSize,
            total: 2000,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30"],
            // Chỗ này có thời gian anh viết lại cho chuẩn nhé. Code chỗ onChange,onShowSizeChange này chưa Ok lắm đâu
            onChange: (page, pageSize) => {
              axios
                .get(
                  `${config.host}/evidence?limit=${pageSize}&from=${(page - 1) * pageSize
                  }`
                )
                .then((res) => {
                  setTotal(res.data.total_hits)
                  setItems(formatResponse(res.data.evidences))
                });
            },
            onShowSizeChange: (current, size) => {
              axios
                .get(
                  `${config.host}/evidence?limit=${size}&from=${(current - 1) * size
                  }`
                )
                .then((res) => {
                  setTotal(res.data.total_hits)
                  setItems(formatResponse(res.data.evidences))
                });
            },
          }}
        />
      </div>

      <Drawer
        title={viewDetailsId ? `Details Evidence By PMID: ${viewDetailsId}` : ""}
        width="80%"
        open={visible}
        forceRender
        zIndex={1002}
        onClose={() => {
          setVisible(false);
          onReset();
        }}
      >
        <h1>
          {highlightText(
            selectedData?.title ?? "",
            fullArrText
          )}
        </h1>

        {highlightText(
          myPost,
          fullArrText
        )}
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <Card
          title={"Raw Extracted Relation"}
        >
          <Table
            scroll={{
              x: "auto",
            }}
            columns={columns2}
            dataSource={selectedData?.raw_relations}
          />
        </Card>
      </Drawer>
    </div>
  );
}

export default Evidence;

