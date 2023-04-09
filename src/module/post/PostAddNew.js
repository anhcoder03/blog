import slugify from "slugify";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useAuth } from "../../contexts/auth-context";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import { db } from "../../firebase/config";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import ImageUpload from "../../components/image/ImageUpload";
import { Dropdown } from "../../components/dropdown";
import Toggle from "../../components/toggle/Toggle";
import { Button } from "../../components/button";
import DashboardHeading from "../dashboard/DashboardHeading";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import { imgbbAPI } from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

Quill.register("modules/imageUploader", ImageUploader);
const PostAddNew = () => {
  const schema = yup.object({
    title: yup.string().required("Bạn phải nhập tiêu đề"),
    category: yup.object().required("Bạn phải chọn Category"),
  });
  const { userInfo } = useAuth();
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      hot: false,
      image: "",
      category: {},
      user: {},
      content: "",
      categoryId: "",
    },
    resolver: yupResolver(schema),
  });
  const watchHot = watch("hot");
  const image_name = getValues("image_name");
  const { image, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, image_name);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.email) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.size);
      querySnapshot.forEach((doc) => {
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email]);
  const addPostHandler = async (values) => {
    if (!image) {
      toast.error("Vui lòng chọn ảnh!");
      return;
    }
    if (!selectCategory) {
      toast.error("Vui lòng chọn danh mục!");
      return;
    }
    if (!content) {
      toast.error("Vui lòng nhập nội dung bài viết!");
      return;
    }
    if (!isValid) return;
    setLoading(true);
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      cloneValues.status = Number(values.status);
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValues,
        image,
        status: 2,
        content,
        createdAt: serverTimestamp(),
      });
      reset({
        title: "",
        slug: "",
        status: 2,
        hot: false,
        image: "",
        category: {},
        user: {},
        content: "",
        categoryId: "",
      });
      setSelectCategory({});
      toast.success("Create new post successfully!");
      navigate("/manage/posts");
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getData();
  }, []);

  useEffect(() => {
    document.title = "Monkey Blogging - Add new post";
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: imgbbAPI,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );

  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setValue("categoryId", docData.id);
    setSelectCategory(item);
  };
  useEffect(() => {
    const arrayError = Object.values(errors);
    if (arrayError.length > 0) {
      toast.error(arrayError[0]?.message);
    }
  }, [errors]);
  return (
    <>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)} className="mt-10">
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
              className="h-[250px]"
              progress={progress}
              image={image}
            ></ImageUpload>
          </Field>
          <div className="flex flex-col">
            <Field>
              <Label>Category</Label>
              <Dropdown name="category">
                <Dropdown.Select placeholder="Select the category"></Dropdown.Select>
                <Dropdown.List>
                  {categories.length > 0 &&
                    categories.map((item) => (
                      <Dropdown.Option
                        key={item.id}
                        onClick={() => handleClickOption(item)}
                      >
                        {item.name}
                      </Dropdown.Option>
                    ))}
                </Dropdown.List>
              </Dropdown>
              {selectCategory?.name && (
                <span className="inline-block p-3 rounded-lg bg-green-50 text-sm text-green-600 font-medium">
                  {selectCategory?.name}
                </span>
              )}
            </Field>
            <Field>
              <Label>Feature post</Label>
              <Toggle
                on={watchHot === true}
                onClick={() => setValue("hot", !watchHot)}
              ></Toggle>
            </Field>
          </div>
        </div>
        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                modules={modules}
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={loading}
          disabled={loading}
        >
          Add new post
        </Button>
      </form>
    </>
  );
};

export default PostAddNew;
