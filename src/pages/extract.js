import { Input, Table, Tag } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import config from "../config";

const Extract = () => {
  const [keySearch, setKeySearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rowData, setRowData] = useState();
  const [workflow_id, setWorkID] = useState();
  const ref = useRef(null);

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
                workflow_id: workflow_id,
                pmid: keySearch,
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
      </div>
    </>
  );
};

export default Extract;
