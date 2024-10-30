import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className='w-full'> 
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="sdrmgkwad9xpue3h4x08zlj9mwzohcr34tr1y3y3tf2mkjxr"
            initialValue={defaultValue}
            init={{
              height: window.innerWidth < 576 ? 300 : 500, // Responsive height based on screen width
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
              ],
              toolbar: "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style: `
                body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
                @media (max-width: 576px) {
                  .tox .tox-toolbar { flex-wrap: wrap; }
                  .tox .tox-toolbar__primary { display: flex; flex-wrap: wrap; }
                  .tox .tox-toolbar__group { flex: 1 0 50%; }
                }
              `,
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}
