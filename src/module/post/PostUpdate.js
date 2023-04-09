import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { postStatus } from "../../utils/constants";
import FieldCheckboxes from "../../drafts/FieldCheckboxes";
import { Label } from "../../components/label";
import { Field } from "../../components/field";
import Toggle from "../../components/toggle/Toggle";
import { Dropdown } from "../../components/dropdown";
import ImageUpload from "../../components/image/ImageUpload";
import { Input } from "../../components/input";
import DashboardHeading from "../dashboard/DashboardHeading";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import { useState } from "react";
import slugify from "slugify";
import { toast } from "react-toastify";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import { imgbbAPI } from "../../config/apiConfig";
import axios from "axios";

Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });
  const imageUrl = getValues("image");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const image_name = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, image_name, handleDeletePhoto);
  async function handleDeletePhoto() {
    const colRef = doc(db, "posts", postId);
    await updateDoc(colRef, {
      image: "",
    });
  }
  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "posts", postId);
      const single = await getDoc(colRef);
      reset(single.data());
      setImage(single.data().image);
      setSelectCategory(single.data().category);
      setContent(single.data().content);
    }
    fetchData();
  }, [postId, reset, setImage]);

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

  const handleUpdatePost = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, "posts", postId);
      await updateDoc(colRef, {
        ...values,
        title: values.title,
        slug: slugify(values.slug || values.title, { lower: true }),
        status: Number(values.status),
        image,
        content,
      });
      toast.success("Update post successfully!");
      navigate("/manage/posts");
    } catch (error) {
      toast.error("Can not update user!");
    }
  };
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
    setSelectCategory(item);
  };

  const watchStatus = watch("status");
  const watchHot = watch("hot");
  return (
    <>
      <DashboardHeading
        title="Update post"
        desc={`Update post: ${postId}`}
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdatePost)}>
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
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
          <Field>
            <Label>Category</Label>
            <Dropdown>
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
        </div>
        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={Number(postStatus.APPROVED)}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={Number(postStatus.PENDING)}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={Number(postStatus.REJECTED)}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
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
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update post
        </Button>
      </form>
    </>
  );
};

export default PostUpdate;
