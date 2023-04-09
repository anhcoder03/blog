import React from "react";
import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import ImageUpload from "../../components/image/ImageUpload";
import * as yup from "yup";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useAuth } from "../../contexts/auth-context";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useEffect } from "react";
import { toast } from "react-toastify";
import slugify from "slugify";
import { yupResolver } from "@hookform/resolvers/yup";

const UserProfile = () => {
  const schema = yup.object({
    fullname: yup.string().required("Vui lòng nhập fullname!"),
    email: yup
      .string()
      .required("Vui lòng nhập email!")
      .email("Vui lòng nhập đúng định dạng email!"),
    password: yup
      .string()
      .required("Vui lòng nhập mật khẩu!")
      .min(8, "Mật khẩu ít nhất phải 8 ký tự!"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp!"),
  });

  const { userInfo } = useAuth();
  const userId = userInfo?.uid;
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {},
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
    if (!isValid) return;
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        photoURL: image,
        fullname: values.fullname,
        slug: slugify(values.fullname, { lower: true }),
      });
      toast.success("Update information successfully!");
    } catch (error) {
      toast.error("Can not update information!");
    }
  };
  useEffect(() => {
    const arrayError = Object.values(errors);
    if (arrayError.length > 0) {
      toast.error(arrayError[0]?.message);
    }
  }, [errors]);

  return (
    <div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form className="mt-10" onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="text-center mb-10">
          <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
            <ImageUpload
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
              progress={progress}
              image={image}
              className={"!rounded-full h-full"}
            ></ImageUpload>
          </div>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              control={control}
              name="fullname"
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>Email</Label>
            <Input
              control={control}
              name="email"
              placeholder="Enter your email address"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>New Password</Label>
            <Input
              control={control}
              name="password"
              type="password"
              placeholder="Enter your password"
            ></Input>
          </Field>
          <Field>
            <Label>Confirm Password</Label>
            <Input
              control={control}
              name="confirmPassword"
              type="password"
              placeholder="Enter your confirm password"
            ></Input>
          </Field>
        </div>
        <Button
          type={"submit"}
          kind="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="mx-auto w-[200px]"
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
