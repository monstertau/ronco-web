import { Input, Table, Tag, Card, Drawer,Button,Space } from "antd";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import config from "../config";

const Extract = () => {
  const [keySearch, setKeySearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rowData, setRowData] = useState();
  const [workflow_id, setWorkID] = useState();
  const ref = useRef(null);

  const [visible, setVisible] = useState(false);
  const [viewDetailsId, setViewDetailsId] = useState(null);
  const [myPost, setMyPost] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [group, setGroup] = useState([])
  const [fullArrText, setFullArrText] = useState([])

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
      console.log(id)
      if (id) {
        const { data } = await axios.get(`${config.host}/evidence/${id}?is_pmid=true`)
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

  const onReset = () => {
    setViewDetailsId(null);
    setSelectedData(null)
  };

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

  const onChange = async (value) => {
    setIsSubmitting(true);
    let arr = value.split(",").map((item) => {
      return item.trim();
    });
    let data = {
      pmids: arr,
    };

    await axios
      .post(`${config.host}/extract/custom`, data)
      .then(async (res) => {
        ref.current = "";
        setWorkID(res.data.workflow_id);
      });
  };

  const columns = [
    {
      title: "Job ID",
      dataIndex: "workflow_id",
      key: "workflow_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        switch (text) {
          case "Running":
            return (
              <Tag color="blue" key={text}>
                {text}
              </Tag>
            );
          case "Completed":
            return (
              <Tag color="green" key={text}>
                {text}
              </Tag>
            );
          case "Failed":
            return (
              <Tag color="red" key={text}>
                {text}
              </Tag>
            );

          default:
            return "";
        }
      },
    },
    {
      title: "Start time",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => {
        return text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    {
      title: "End time",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => {
        return text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    {
      title: "Extracted PMID",
      dataIndex: "pmid",
      key: "pmid",
    },
    {
      title: "Actions",
      width: 100,
      fixed: "right",
      dataIndex: "id",
      key: "id",
      render: (id, row) => (
        isSubmitting?"":
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

  useEffect(() => {
    if (
      ref.current?.status !== "Completed" &&
      ref.current?.status !== "Failed" &&
      workflow_id
    ) {
      const interval = setInterval(() => {
        axios
          .get(`${config.host}/extract/custom?workflow_id=${workflow_id}`)
          .then((res2) => {
            
            ref.current = res2.data;
            setRowData([
              {
                id: keySearch,
                workflow_id: workflow_id,
                pmid: res2.data.pmid_result.pmids?res2.data.pmid_result.pmids[0]:"",
                ...res2.data,
              },
            ]);
            if (
              res2.data?.status === "Completed" ||
              res2.data?.status === "Failed"
            ) {
              setIsSubmitting(false);
              clearInterval(interval);
            }
          });
      }, 2000);
    }
  }, [workflow_id, ref, keySearch]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "Center",
          alignItems: "Center",
          // height: "100vh",
        }}
      >
        <h1>Extract custom page</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "Center",
          alignItems: "Center",
          // height: "100vh",
        }}
      >
        <div style={{ width: "50%" }}>
          <div style={{ marginBottom: "10px", fontSize: "24px" }}>
            Input your pubmed ID
          </div>
          <Input
            disabled={isSubmitting}
            onChange={(e) => setKeySearch(e.target.value)}
            onKeyDown={async (e) => {
              if (e.code === "Enter") {
                await onChange(keySearch);
              }
            }}
          />
          <div style={{ marginTop: "10px" }}>
            {rowData && (
              <>
                <Table
                  columns={columns}
                  dataSource={rowData}
                  pagination={false}
                />
              </>
            )}
          </div>
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
    </>
  );
};

export default Extract;
