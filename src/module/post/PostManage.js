import React from "react";
import { Table } from "../../components/table";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Button } from "../../components/button";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import formatDate from "../../utils/formatDate";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { PER_PAGE, postStatus } from "../../utils/constants";
import LabelStatus from "../../components/label/LabelStatus";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/auth-context";

const PostManage = () => {
  const { userInfo } = useAuth();
  const [postList, setPostList] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const [lastDoc, setLastDoc] = useState();
  const [total, setTotal] = useState(0);
  const handleLoadmoreCategory = async () => {
    const nextRef = query(
      collection(db, "posts"),
      startAfter(lastDoc),
      limit(1)
    );
    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPostList([...postList, ...results]);
    });
    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "posts");
      const newRef = filter
        ? query(
            colRef,
            where("title", ">=", filter),
            where("title", "<=", filter + "utf8")
          )
        : query(colRef, limit(PER_PAGE));
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size);
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostList(results);
        console.log(results);
      });
      setLastDoc(lastVisible);
    }
    fetchData();
  }, [filter]);

  const handleInputFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 500);
  const handleDeletePost = async (docId) => {
    if (userInfo.uid !== "VLbknqv6O2bGeTx1lIHAhwAZ3Aq2") {
      toast.error("Bạn không có quyền thực hiện thao tác này!");
      return;
    }
    const colRef = doc(db, "posts", docId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const handleNavigateToUpdatePost = (postId) => {
    if (userInfo.uid !== "VLbknqv6O2bGeTx1lIHAhwAZ3Aq2") {
      toast.error("Bạn không có quyền thực hiện thao tác này!");
      return;
    }
    navigate(`/manage/update-post?id=${postId}`);
  };

  return (
    <div>
      <DashboardHeading
        title="All posts"
        desc="Manage all posts"
      ></DashboardHeading>
      <div className="mb-10 flex justify-end gap-5">
        <div className="w-full max-w-[200px]"></div>
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
            onChange={handleInputFilter}
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {postList.length > 0 &&
            postList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-[66px] h-[55px] rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm max-w-[300px]">
                        {item.title}
                      </h3>
                      <time className="text-sm text-gray-500">
                        Date: {formatDate(item.createdAt.seconds)}
                      </time>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-gray-500">{item.category.name}</span>
                </td>
                <td>
                  <span className="text-gray-500">{item.user.fullname}</span>
                </td>
                <td>
                  {item.status === postStatus.APPROVED && (
                    <LabelStatus type="success">Approved</LabelStatus>
                  )}
                  {item.status === postStatus.PENDING && (
                    <LabelStatus type="warning">Pending</LabelStatus>
                  )}
                  {item.status === postStatus.REJECTED && (
                    <LabelStatus type="danger">Rejected</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-x-3 text-gray-500">
                    <ActionView
                      onClick={() => navigate(`/${item.slug}`)}
                    ></ActionView>
                    <ActionEdit
                      onClick={() => handleNavigateToUpdatePost(item.id)}
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeletePost(item.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {total > postList.length && (
        <div className="mt-10 text-center">
          <Button
            kind="ghost"
            type={"button"}
            className="mx-auto w-[200px]"
            onClick={handleLoadmoreCategory}
          >
            See more+
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostManage;
