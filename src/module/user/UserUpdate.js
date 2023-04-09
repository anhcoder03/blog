import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { Button } from "../../components/button";
import { userRole, userStatus } from "../../utils/constants";
import { Radio } from "../../components/checkbox";
import FieldCheckboxes from "../../drafts/FieldCheckboxes";
import { Label } from "../../components/label";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import ImageUpload from "../../components/image/ImageUpload";
import DashboardHeading from "../dashboard/DashboardHeading";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import slugify from "slugify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const UserUpdate = () => {
  const schema = yup.object({
    fullname: yup.string().required("Bạn cần nhập fullname"),
    email: yup
      .string()
      .email("Email không đúng định dạng")
      .required("Bạn cần nhập email"),
    password: yup
      .string()
      .min(8, "password quá ngắn")
      .max(16, "password quá dài"),
    role: yup.number().required("Bạn cần chọn quyền của user"),
    status: yup.number().required("Bạn cần chọn trạng thái của user"),
  });
  const [params] = useSearchParams();
  const userId = params.get("id");
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const imageUrl = getValues("photoURL");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const image_name = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, image_name, handleDeleteAvatar);
  async function handleDeleteAvatar() {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      photoURL: "",
    });
  }
  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "users", userId);
      const single = await getDoc(colRef);
      reset(single.data());
      setImage(single.data().photoURL);
    }
    fetchData();
  }, [userId, reset, setImage]);
  const handleUpdateUser = async (values) => {
    if (!image) {
      toast.error("Vui lòng chọn ảnh!");
      return;
    }
    if (!isValid) return;
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        photoURL: image,
        fullname: values.fullname,
        slug: slugify(values.slug || values.fullname, { lower: true }),
        status: Number(values.status),
        role: Number(values.role),
      });
      toast.success("Update user successfully!");
      navigate("/manage/user");
    } catch (error) {
      toast.error("Email đã tồn tại! vui lòng chọn email khác!");
      console.log(error);
    }
  };
  const watchStatus = watch("status");
  const watchRole = watch("role");

  useEffect(() => {
    const arrayError = Object.values(errors);
    if (arrayError.length > 0) {
      toast.error(arrayError[0]?.message);
    }
  }, [errors]);
  if (!userId) return null;
  return (
    <div>
      <DashboardHeading
        title="Update user"
        desc="Add new user to system"
      ></DashboardHeading>
      <form className="mt-10" onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
          <ImageUpload
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            progress={progress}
            image={image}
            className={"!rounded-full h-full"}
          ></ImageUpload>
        </div>

        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="text"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          type={"submit"}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="mx-auto w-[200px]"
        >
          Update user
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
